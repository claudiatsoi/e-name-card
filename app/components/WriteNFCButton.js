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
    <div className={className ? "w-full h-full relative" : "w-full mb-2 relative"}>
        <button
        onClick={handleWrite}
        className={className ? `${className} flex flex-col items-center justify-center gap-2 !p-0` : "w-full bg-purple-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-purple-700 transition duration-300 text-sm shadow-sm"}
        >
        {status === 'writing' ? (
             <span className="animate-pulse">Tap Tag...</span>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
            </svg>
            <span>Write to NFC Tag</span>
          </>
        )}
        </button>
        
        {status === 'unsupported' && (
            <div className="absolute top-full left-0 w-full text-center">
                <p className="text-[10px] text-red-500 bg-white/90 px-1 rounded shadow-sm inline-block mx-auto mt-1">
                    Not supported
                </p>
            </div>
        )}
        {status === 'error' && (
             <p className="text-xs text-red-500 mt-2 text-center">
               Error: {errorMsg}
            </p>
        )}
    </div>
  );
}
