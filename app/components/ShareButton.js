'use client';
import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { toPng } from 'html-to-image';
import download from 'downloadjs';

export default function ShareButton({ title, text, url, className, variant, cardTitle, cardSubtitle }) {
  const [copied, setCopied] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [savingImage, setSavingImage] = useState(false);

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
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy', err);
        }
    }
  };

  const handleSaveImage = async () => {
     setSavingImage(true);
     // Try to find the visual card element
     const node = document.getElementById('user-card-visual');
     try {
       if (node) {
          const dataUrl = await toPng(node, { cacheBust: true, backgroundColor: '#ffffff' });
          download(dataUrl, 'name-card.png');
       } else {
          console.warn('Card element not found');
       }
     } catch (err) {
       console.error('Failed to save image', err);
     } finally {
       setSavingImage(false);
     }
  };

  const handleWallet = () => {
     alert("Wallet passes require manual setup or a backend service. This is a UI placeholder.");
  };

  if (variant === 'card') {
    return (
       <>
       <button onClick={() => setShowModal(true)} className="flex flex-1 gap-4 rounded-xl border border-black/5 bg-white p-5 flex-col whisper-shadow active:bg-primary/5 transition-colors cursor-pointer text-left w-full h-full hover:shadow-md">
          <div className="text-primary bg-primary/10 size-10 rounded-lg flex items-center justify-center">
             <span className="material-symbols-outlined">qr_code_2</span>
          </div>
          <div className="flex flex-col gap-0.5">
             <h2 className="text-[#121517] text-base font-bold leading-tight">{cardTitle || 'Share'}</h2>
             <p className="text-[#657b86] text-xs font-normal leading-normal">{cardSubtitle || 'QR Code & Link'}</p>
          </div>
       </button>

       {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)}>
            <div className="bg-white dark:bg-[#1f2226] rounded-2xl w-full max-w-[340px] p-6 shadow-2xl relative flex flex-col items-center gap-6 animate-in fade-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
                    <span className="material-symbols-outlined text-gray-400">close</span>
                </button>
                
                <div className="text-center mt-2">
                    <h3 className="text-xl font-bold text-[#121517] dark:text-white mb-1">Scan to Connect</h3>
                    <p className="text-sm text-[#657b86] dark:text-white/60">Share this profile seamlessly</p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-inner">
                    <QRCodeSVG value={url} size={160} />
                </div>

                {/* Additional Action Grid */}
                 <div className="grid grid-cols-3 gap-3 w-full">
                    {/* Add to Apple Wallet */}
                    <button 
                      onClick={() => alert('Apple Wallet integration requires a backend pass generator service.')} 
                      className="flex flex-col items-center justify-center gap-2 p-3 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors group"
                    >
                        <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                             <span className="material-symbols-outlined text-[20px]">wallet</span>
                        </div>
                        <span className="text-[10px] text-center font-medium leading-tight text-[#657b86]">Apple Wallet</span>
                    </button>

                     {/* Add to Google Wallet */}
                    <button 
                       onClick={() => alert('Google Wallet integration requires a backend pass generator service.')}
                       className="flex flex-col items-center justify-center gap-2 p-3 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors group"
                    >
                        <div className="w-10 h-10 rounded-full bg-white border border-gray-200 text-[#121517] flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                             <span className="material-symbols-outlined text-[20px]">account_balance_wallet</span>
                        </div>
                        <span className="text-[10px] text-center font-medium leading-tight text-[#657b86]">Google Wallet</span>
                    </button>

                    {/* Save Image */}
                    <button 
                       onClick={handleSaveImage}
                       className="flex flex-col items-center justify-center gap-2 p-3 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors group"
                    >
                        <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                             <span className="material-symbols-outlined text-[20px]">{savingImage ? 'downloading' : 'image'}</span>
                        </div>
                        <span className="text-[10px] text-center font-medium leading-tight text-[#657b86]">Save Image</span>
                    </button>
                 </div>

                <div className="w-full pt-4 border-t border-gray-100 dark:border-white/5">
                    <button
                        onClick={handleShare}
                        className="w-full flex items-center justify-center gap-2 bg-primary text-white py-3 px-6 rounded-xl font-bold hover:bg-[#144f6d] transition-transform active:scale-95 shadow-lg shadow-primary/20"
                    >
                        {copied ? (
                            <>
                                <span className="material-symbols-outlined text-[20px]">check</span>
                                <span>Link Copied!</span>
                            </>
                        ) : (
                            <>
                                <span className="material-symbols-outlined text-[20px]">ios_share</span>
                                <span>Share Page Link</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
       )}
       </>
    );
  }

  return (
    <button
      onClick={handleShare}
      className={className || "w-full bg-indigo-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-indigo-700 transition duration-300 mb-2 flex items-center justify-center gap-2 text-sm shadow-sm"}
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
