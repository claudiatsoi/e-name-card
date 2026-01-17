'use client';
import { useState, useEffect } from 'react';

export default function AddToHomeScreenButton({ className }) {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const isIosDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    setIsIOS(isIosDevice);

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    } else if (isIOS) {
      alert("To add to Home Screen:\n1. Tap the Share button in your browser toolbar\n2. Scroll down and tap 'Add to Home Screen'");
    } else {
      alert("To add to Home Screen, use your browser's menu option 'Add to Home Screen' or 'Install app'.");
    }
  };

  return (
    <button
      onClick={handleInstallClick}
      className={className}
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5h3m-6.75 2.25h10.5a2.25 2.25 0 002.25-2.25v-15a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 4.5v15a2.25 2.25 0 002.25 2.25z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 10.5v6m0 0l-1.5-1.5M12 16.5l1.5-1.5" />
      </svg>
      Add to Home
    </button>
  );
}
