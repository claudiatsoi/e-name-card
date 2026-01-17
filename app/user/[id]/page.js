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

  const get = (key) => row.get(key) || '';
  const name = get('name');
  const title = get('title');
  const company = get('company');
  const phone = get('phone');
  const email = get('email');
  const areaCode = get('area_code');
  const isWhatsapp = (get('is_whatsapp') || '').toLowerCase() === 'true';

  const fullPhone = areaCode ? `${areaCode}${phone}` : phone;
  const whatsappUrl = isWhatsapp ? `https://wa.me/${fullPhone.replace(/\+/g,'')}` : '';

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
       <div className="bg-white shadow-xl rounded-2xl w-full max-w-sm p-6 text-center border-t-4 border-blue-500">
         
         <div className="mt-4">
            <h1 className="text-2xl font-bold text-gray-900">{name}</h1>
            <p className="text-blue-600 font-medium">{title}</p>
            <p className="text-gray-500 text-sm mt-1">{company}</p>
         </div>

         <div className="mt-8 space-y-4 text-left">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-500 uppercase text-xs font-bold w-12">Phone</span>
                <div className="flex flex-col">
                  <a href={`tel:${fullPhone}`} className="text-gray-800 hover:text-blue-600">
                    {areaCode && <span>+{areaCode} </span>}{phone}
                  </a>
                  {isWhatsapp && (
                    <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="text-green-600 text-xs font-bold hover:underline mt-1">
                      Chat on WhatsApp
                    </a>
                  )}
                </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-500 uppercase text-xs font-bold w-12">Email</span>
                <a href={`mailto:${email}`} className="text-gray-800 hover:text-blue-600 break-all">{email}</a>
            </div>
         </div>

         <div className="mt-8">
            <ShareButton title={`${name} - ${title}`} text={`Check out ${name}'s digital business card!`} url={`https://e-name-card.vercel.app/user/${id}`} />
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
              className="block mt-4 w-full bg-gray-200 text-gray-700 font-bold py-3 px-4 rounded-lg hover:bg-gray-300 transition duration-300 text-center"
            >
               Create New Card
            </Link>
         </div>
         
         <div className="mt-8 text-xs text-gray-400">
            Powered by Claudia Tsoi
         </div>
       </div>
    </div>
  );
}
