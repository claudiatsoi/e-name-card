'use client';
import { useState } from 'react';

export default function WriteNFCButton({ className, variant, cardTitle, cardSubtitle }) {
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
    if (variant === 'card') {
        return (
            <button className="flex flex-1 gap-4 rounded-xl border border-green-200 bg-green-50 p-5 flex-col whisper-shadow cursor-default text-left w-full h-full">
                <div className="text-green-600 bg-green-100 size-10 rounded-lg flex items-center justify-center">
                    <span className="material-symbols-outlined">check_circle</span>
                </div>
                <div className="flex flex-col gap-0.5">
                    <h2 className="text-green-800 text-base font-bold leading-tight">Success!</h2>
                    <p className="text-green-600 text-xs font-normal leading-normal">Tag written.</p>
                </div>
            </button>
        )
    }
    return (
        <button className={className ? `${className} bg-green-600` : "w-full bg-green-600 text-white font-medium py-2 px-4 rounded-lg mb-2 pointer-events-none text-sm shadow-sm"}>
            Success!
        </button>
    );
  }

  if (variant === 'card') {
    return (
       <div className="relative w-full h-full">
           <button onClick={handleWrite} className="flex flex-1 gap-4 rounded-xl border border-black/5 bg-white p-5 flex-col whisper-shadow active:bg-primary/5 transition-colors cursor-pointer text-left w-full h-full hover:shadow-md">
              <div className="text-primary bg-primary/10 size-10 rounded-lg flex items-center justify-center">
                 <span className="material-symbols-outlined">contactless</span>
              </div>
              <div className="flex flex-col gap-0.5">
                 <h2 className="text-[#121517] text-base font-bold leading-tight">
                    {status === 'writing' ? 'Tap Tag...' : (cardTitle || 'Write to NFC')}
                 </h2>
                 <p className="text-[#657b86] text-xs font-normal leading-normal">
                    {status === 'writing' ? 'Hold phone near tag' : (cardSubtitle || 'Program NFC tag')}
                 </p>
              </div>
           </button>
           {status === 'unsupported' && <div className="absolute top-0 right-0 bg-red-100 text-red-600 text-[10px] px-1 rounded">Unsupported</div>}
       </div>
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
