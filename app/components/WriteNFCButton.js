'use client';
import { useState } from 'react';

export default function WriteNFCButton({ className }) {
  const [status, setStatus] = useState('idle'); // idle, writing, success, error, unsupported
  const [errorMsg, setErrorMsg] = useState('');

  const handleWrite = async () => {
    if (!('NDEFReader' in window)) {
      setStatus('unsupported');
      return;
    }

    setStatus('writing');
    try {
      const ndef = new NDEFReader();
      await ndef.write({
        records: [
          { recordType: "url", data: window.location.href }
        ]
      });
      setStatus('success');
    } catch (error) {
      console.error(error);
      setStatus('error');
      setErrorMsg(error.message || "Failed to write NFC");
    }
  };

  if (status === 'success') {
    return (
        <button className={className ? `${className} bg-green-600` : "w-full bg-green-600 text-white font-medium py-2 px-4 rounded-lg mb-2 pointer-events-none text-sm shadow-sm"}>
            Success!
        </button>
    );
  }

  return (
    <div className={className ? "w-full h-full" : "w-full mb-2"}>
        <button
        onClick={handleWrite}
        className={className || "w-full bg-purple-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-purple-700 transition duration-300 text-sm shadow-sm"}
        >
        {status === 'writing' ? 'Tap NFC Tag Now...' : 'Write to NFC Tag'}
        </button>
        
        {status === 'unsupported' && (
            <p className="text-xs text-red-500 mt-2 text-center">
                Your browser does not support NFC writing (Try Chrome on Android).
            </p>
        )}
        {status === 'error' && (
             <p className="text-xs text-red-500 mt-2 text-center">
               Error: {errorMsg}
            </p>
        )}
    </div>
  );
}
