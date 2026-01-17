'use client';
import { useState } from 'react';

export default function WriteNFCButton({ className, variant, cardTitle, cardSubtitle }) {
  const [status, setStatus] = useState('idle'); // idle, writing, success, error, unsupported
  const [errorMsg, setErrorMsg] = useState('');

  const handleWrite = async () => {
    if (!('NDEFReader' in window)) {
      setStatus('unsupported');
      setErrorMsg("NFC writing is not supported on iOS. Please try Chrome on Android.");
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
           
           {(status === 'unsupported' || status === 'error') && (
             <div className="absolute inset-0 bg-white/95 z-20 flex flex-col items-center justify-center text-center p-4 rounded-xl border border-red-200 backdrop-blur-sm">
                <span className="material-symbols-outlined text-red-500 mb-1 text-2xl">error</span>
                <p className="text-red-700 text-xs font-bold uppercase tracking-wider mb-1">
                   {status === 'unsupported' ? 'Not Supported' : 'Write Failed'}
                </p>
                <p className="text-[#657b86] text-[10px] leading-tight px-1 mb-2">
                   {errorMsg || (status === 'unsupported' ? 'NFC writing not available on this device.' : 'An error occurred.')}
                </p>
                <button 
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setStatus('idle'); }} 
                  className="text-[10px] bg-red-50 text-red-600 px-3 py-1.5 rounded-full font-bold uppercase tracking-wide border border-red-100 hover:bg-red-100 transition-colors"
                >
                  Dismiss
                </button>
             </div>
           )}
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
            <div className="absolute top-full left-0 w-full text-center z-10 mt-1">
                <div className="bg-white/95 border border-red-200 p-2 rounded-lg shadow-md mx-auto max-w-[200px] backdrop-blur-sm">
                   <p className="text-[10px] text-red-600 font-bold mb-1">Not Supported</p>
                   <p className="text-[9px] text-[#657b86] leading-tight">{errorMsg}</p>
                </div>
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
