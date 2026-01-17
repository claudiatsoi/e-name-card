'use client';
import { useState } from 'react';

export default function ShareButton({ title, text, url }) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
        // Fallback to clipboard
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy', err);
        }
    }
  };

  return (
    <button
      onClick={handleShare}
      className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 transition duration-300 mb-4 flex items-center justify-center gap-2"
    >
      {copied ? (
         <span>Link Copied!</span>
      ) : (
         <>
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
             <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.287.696.345 1.084m-3.123 2.186a2.25 2.25 0 01-1.11-4.045m6.879 2.152a2.38 2.38 0 011.697 1.83m-1.697-1.83a2.378 2.378 0 001.697-1.83m.667 9.172v-9.172" />
             <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
            Share Card
         </>
      )}
    </button>
  );
}
