import Link from 'next/link';
import { getSheet } from '@/lib/googleSheet';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import SaveContactButton from '@/app/components/SaveContactButton';
import WriteNFCButton from '@/app/components/WriteNFCButton';
import ShareButton from '@/app/components/ShareButton';
import AddToHomeScreenButton from '@/app/components/AddToHomeScreenButton';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function UserCard({ params }) {
  const { id } = await params;
  
  let row;
  try {
    const sheet = await getSheet('User_Cards');
    const rows = await sheet.getRows();
    row = rows.find(r => (r.get('id') || '') === id);
  } catch (error) {
     console.error(error);
  }

  if (!row) {
    return notFound();
  }

  const get = (key) => row.get(key) || row.get(key.toLowerCase()) || row.get(key.toUpperCase()) || row.get(key.replace('_', ' ')) || '';
  
  const name = get('name');
  const title = get('title');
  const company = get('company');
  const phone = String(get('phone') || '').trim();
  const email = get('email');
  const areaCode = String(get('area_code') || get('Area Code') || get('Area_Code') || '').trim();
  const isWhatsapp = String(get('is_whatsapp') || get('Is Whatsapp') || '').trim().toLowerCase() === 'true';

  const fullPhone = areaCode ? `${areaCode}${phone}` : phone;
  const whatsappUrl = isWhatsapp ? `https://wa.me/${fullPhone.replace(/[^0-9]/g,'')}` : '';

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
       <div className="bg-white shadow-xl rounded-[2rem] w-full max-w-sm overflow-hidden border border-gray-100 relative">
         
         {/* Top Banner Decoration */}
         <div className="h-32 bg-white relative flex items-center justify-center">
             <div className="relative w-40 h-12">
                <Image 
                    src="/eventx-logo.png" 
                    alt="EventX" 
                    fill 
                    className="object-contain"
                    priority
                /> 
             </div>
         </div>

         <div className="px-6 pb-6 pt-6 text-center">
             <h1 className="text-2xl font-bold text-gray-900">{name}</h1>
             <p className="text-blue-600 font-bold text-sm tracking-wide uppercase mt-1">{title}</p>
             <p className="text-gray-500 text-sm mt-1">{company}</p>
         </div>

         <div className="px-6 space-y-4">
            {/* Phone Row */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl border border-gray-100">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-700 shadow-sm border border-gray-100">
                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                       <path fillRule="evenodd" d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.25V4.5z" clipRule="evenodd" />
                     </svg>
                  </div>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest hidden sm:block">Mobile</span>
               </div>
               <a href={`tel:${fullPhone}`} className="text-gray-900 font-bold text-sm hover:text-blue-600">
                  {areaCode && <span>+{areaCode} </span>}{phone}
               </a>
            </div>

            {/* WhatsApp Row - Highlighted */}
            {isWhatsapp && (
             <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 bg-green-50 rounded-2xl border border-green-100 hover:bg-green-100 transition-colors group">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white shadow-sm group-hover:scale-110 transition-transform">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                         <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592z"/>
                      </svg>
                  </div>
                  <span className="text-xs font-bold text-green-700 uppercase tracking-widest">WhatsApp</span>
               </div>
               <div className="flex items-center text-green-700 font-bold text-xs gap-1">
                  Chat Now
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                  </svg>
               </div>
             </a>
            )}

            {/* Email Row */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl border border-gray-100">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-700 shadow-sm border border-gray-100">
                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                       <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
                       <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
                     </svg>
                  </div>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest hidden sm:block">Email</span>
               </div>
               <a href={`mailto:${email}`} className="text-gray-900 font-bold text-xs hover:text-blue-600 truncate max-w-[150px] text-right">
                  {email}
               </a>
            </div>
         </div>

         {/* Modern Grid Actions - Monochrome/Sleek */}
         <div className="p-6 mt-2 grid grid-cols-2 gap-3">
            <ShareButton 
                title={`${name} - ${title}`} 
                text={`Here's ${name} business card! Save it on your phone and create your own one!`} 
                url={`https://e-name-card-hazel.claunode.com/user/${id}`} 
                className="bg-gray-900 border border-gray-900 text-white rounded-xl flex flex-col items-center justify-center py-4 gap-2 shadow-sm active:scale-95 transition-all text-xs font-bold hover:bg-gray-800"
            />

            <Link 
              href={`/create?ref=${id}`} 
              className="bg-white border border-gray-200 text-gray-400 rounded-xl flex flex-col items-center justify-center py-4 gap-2 shadow-sm active:scale-95 transition-all text-xs font-bold hover:text-blue-600 hover:border-blue-100"
            >
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                 <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
               </svg>
               Create a New Card
            </Link>
            
            <SaveContactButton 
                name={name}
                title={title}
                company={company}
                phone={fullPhone}
                email={email}
                className="bg-red-600 border border-red-600 text-white rounded-xl flex flex-col items-center justify-center py-4 gap-2 shadow-sm active:scale-95 transition-all text-xs font-bold hover:bg-red-700"
            />
            
            <AddToHomeScreenButton 
                className="bg-purple-600 border border-purple-600 text-white rounded-xl flex flex-col items-center justify-center py-4 gap-2 shadow-sm active:scale-95 transition-all text-xs font-bold hover:bg-purple-700"
            />

            <WriteNFCButton 
                // Write NFC: Yellow, Wifi Icon, Full Width (col-span-2)
                className="col-span-2 bg-yellow-400 border border-yellow-400 text-yellow-900 rounded-xl flex flex-col items-center justify-center py-4 gap-2 shadow-sm active:scale-95 transition-all text-xs font-bold hover:bg-yellow-500"
            />
         </div>
         
         <div className="pb-6 text-center">
            <div className="text-[10px] text-gray-300 font-medium tracking-widest uppercase">
               Powered by Claudia Tsoi
            </div>
         </div>
       </div>
    </div>
  );
}
