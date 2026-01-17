import Link from 'next/link';
import { getSheet } from '@/lib/googleSheet';
import { notFound } from 'next/navigation';
import SaveContactButton from '@/app/components/SaveContactButton';
import WriteNFCButton from '@/app/components/WriteNFCButton';
import ShareButton from '@/app/components/ShareButton';

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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
       <div className="bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl w-full max-w-sm p-6 text-center border-t-8 border-blue-600 border border-white/50">
         
         <div className="mt-6 mb-6">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{name}</h1>
            <p className="text-blue-600 font-bold uppercase tracking-wide text-sm mt-1">{title}</p>
            <p className="text-gray-500 font-medium text-sm mt-1">{company}</p>
         </div>

         <div className="space-y-3 text-left">
            {/* Phone */}
            <div className="flex flex-col sm:flex-row p-3 bg-white/60 rounded-xl gap-3 items-center sm:items-start border border-gray-100 shadow-sm">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path fillRule="evenodd" d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.25V4.5z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex flex-col text-center sm:text-left overflow-hidden w-full">
                   <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">Phone</span>
                   <a href={`tel:${fullPhone}`} className="text-gray-900 font-bold hover:text-blue-600 truncate">
                    {areaCode && <span>+{areaCode} </span>}{phone}
                   </a>
                </div>
            </div>

            {/* WhatsApp */}
            {isWhatsapp && (
             <div className="flex flex-col sm:flex-row p-3 bg-white/60 rounded-xl gap-3 items-center sm:items-start border border-gray-100 shadow-sm">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 shrink-0">
                   <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592z"/>
                   </svg>
                </div>
                <div className="flex flex-col text-center sm:text-left overflow-hidden w-full">
                   <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">WhatsApp</span>
                   <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="text-green-600 font-bold hover:underline truncate">
                      Chat on WhatsApp
                   </a>
                </div>
             </div>
            )}
            
            {/* Email */}
            <div className="flex flex-col sm:flex-row p-3 bg-white/60 rounded-xl gap-3 items-center sm:items-start border border-gray-100 shadow-sm">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 shrink-0">
                   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
                    <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
                   </svg>
                </div>
                <div className="flex flex-col text-center sm:text-left overflow-hidden w-full">
                   <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">Email</span>
                   <a href={`mailto:${email}`} className="text-gray-900 font-bold hover:text-blue-600 truncate">
                      {email}
                   </a>
                </div>
            </div>
         </div>

         <div className="mt-8 grid grid-cols-2 gap-4">
            <ShareButton 
                title={`${name} - ${title}`} 
                text={`Here's ${name} business card! Save it on your phone and create your own one!`} 
                url={`https://e-name-card-hazel.claunode.com/user/${id}`} 
                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl flex flex-col items-center justify-center h-24 gap-2 shadow-lg transition-transform active:scale-95 text-xs font-bold"
            />
            
            <SaveContactButton 
                name={name}
                title={title}
                company={company}
                phone={fullPhone}
                email={email}
                className="bg-gray-900 hover:bg-black text-white rounded-2xl flex flex-col items-center justify-center h-24 gap-2 shadow-lg transition-transform active:scale-95 text-xs font-bold"
            />

            <WriteNFCButton 
                className="bg-purple-600 hover:bg-purple-700 text-white rounded-2xl flex flex-col items-center justify-center h-24 gap-2 shadow-lg transition-transform active:scale-95 text-xs font-bold"
            />
            
            <Link 
              href={`/create?ref=${id}`} 
              className="bg-white border-2 border-dashed border-gray-300 hover:border-blue-500 hover:text-blue-600 text-gray-400 rounded-2xl flex flex-col items-center justify-center h-24 gap-2 shadow-sm transition-transform active:scale-95 font-bold text-xs"
            >
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                 <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
               </svg>
               Create New
            </Link>
         </div>
         
         <div className="mt-8 text-xs text-gray-400 font-medium tracking-wide">
            Powered by Claudia Tsoi
         </div>
       </div>
    </div>
  );
}
