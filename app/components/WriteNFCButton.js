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
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
            </svg>
            <span>Write NFC</span>
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
