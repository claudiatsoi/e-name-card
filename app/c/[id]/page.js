import { getSheet } from '@/lib/googleSheet';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import SaveContactButton from '@/app/components/SaveContactButton';
import ShareButton from '@/app/components/ShareButton';
import WriteNFCButton from '@/app/components/WriteNFCButton';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function InternalSalesCard({ params }) {
  const { id } = await params;
  
  let row;
  try {
    const sheet = await getSheet('Internal_Sales');
    const rows = await sheet.getRows();
    row = rows.find(r => (r.get('id') || '') === id);
  } catch (error) {
    console.error("Error fetching sheet data:", error);
  }

  if (!row) {
    return notFound();
  }

  const get = (key) => row.get(key) || '';

  const name = get('name');
  const title = get('title');
  const company = get('company');
  const phone = String(get('phone') || '').trim();
  const email = get('email');
  const linkedin = get('linkedin') || get('LinkedIn URL') || '';
  const areaCode = String(get('area_code') || '').trim();
  const isWhatsapp = String(get('is_whatsapp') || '').trim().toLowerCase() === 'true';

  const fullPhone = areaCode ? `${areaCode}${phone}` : phone;
  const whatsappUrl = isWhatsapp ? `https://wa.me/${fullPhone.replace(/[^0-9]/g,'')}` : '';

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-xl rounded-2xl w-full max-w-sm p-6 space-y-6 text-center border-t-4 border-red-600">
        
        {/* Logo Section - Assuming user uploads logo.png to public folder or uses external URL */}
        <div className="flex justify-center mb-4">
             {/* Using a placeholder text if image is missing, or try to load from public */}
             <div className="relative w-40 h-10">
                <Image 
                    src="/eventx-logo.png" 
                    alt="EventX" 
                    fill 
                    className="object-contain"
                    priority
                /> 
             </div>
        </div>

        <div className="w-24 h-24 bg-red-50 rounded-full mx-auto flex items-center justify-center text-3xl font-bold text-red-600">
            {name.charAt(0)}
        </div>
        
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">{name}</h1>
          <p className="text-red-600 font-medium">{title}</p>
          <p className="text-gray-500 text-sm">{company}</p>
        </div>

        <div className="space-y-4 pt-4 border-t border-gray-100 text-left">
           <div>
              <p className="text-xs text-gray-400 uppercase font-semibold">Phone</p>
              <div className="flex flex-col">
                  <a href={`tel:${fullPhone}`} className="text-gray-800 hover:text-red-600">
                    {areaCode && <span>+{areaCode} </span>}{phone}
                  </a>
              </div>
           </div>
           
           {isWhatsapp && (
             <div>
                <p className="text-xs text-green-600 uppercase font-semibold">WhatsApp</p>
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline break-all text-sm">
                  {whatsappUrl}
                </a>
             </div>
           )}

           <div>
              <p className="text-xs text-gray-400 uppercase font-semibold">Email</p>
              <a href={`mailto:${email}`} className="text-gray-800 hover:text-red-600 break-all">{email}</a>
           </div>
           {linkedin && (
             <div>
                <p className="text-xs text-gray-400 uppercase font-semibold">LinkedIn</p>
                <a href={linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">
                  Profile
                </a>
             </div>
           )}
        </div>

        <div className="space-y-3 pt-6">
          <ShareButton title={`${name} - ${title}`} text={`Here's ${name} business card! Save it on your phone and create your own one!`} url={`https://e-name-card-hazel.claunode.com/c/${id}`} />
          <WriteNFCButton />
          
          <SaveContactButton 
            name={name}
            title={title}
            company={company}
            phone={fullPhone}
            email={email}
          />
          
          <Link 
            href={`/create?ref=${id}`} 
              className="flex items-center justify-center gap-2 mt-6 text-gray-400 hover:text-gray-600 transition-colors text-sm font-medium"
            >
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                 <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
               </svg>
               Create Your Own Card
          </Link>
        </div>
      </div>
    </div>
  );
}
