import { getSheet } from '@/lib/googleSheet';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import SaveContactButton from '@/app/components/SaveContactButton';

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
  const phone = get('phone');
  const email = get('email');
  const linkedin = get('linkedin') || get('LinkedIn URL') || '';

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-xl rounded-2xl w-full max-w-sm p-6 space-y-6 text-center">
        <div className="w-24 h-24 bg-blue-100 rounded-full mx-auto flex items-center justify-center text-3xl font-bold text-blue-600">
            {name.charAt(0)}
        </div>
        
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">{name}</h1>
          <p className="text-blue-600 font-medium">{title}</p>
          <p className="text-gray-500 text-sm">{company}</p>
        </div>

        <div className="space-y-4 pt-4 border-t border-gray-100 text-left">
           <div>
              <p className="text-xs text-gray-400 uppercase font-semibold">Phone</p>
              <a href={`tel:${phone}`} className="text-gray-800 hover:text-blue-600">{phone}</a>
           </div>
           <div>
              <p className="text-xs text-gray-400 uppercase font-semibold">Email</p>
              <a href={`mailto:${email}`} className="text-gray-800 hover:text-blue-600 break-all">{email}</a>
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
          <SaveContactButton 
            name={name}
            title={title}
            company={company}
            phone={phone}
            email={email}
          />
          
          <Link 
            href="/create"
            className="block w-full border border-gray-300 text-gray-700 font-bold py-3 px-4 rounded-lg hover:bg-gray-50 transition duration-300"
          >
            Create Your Own Card
          </Link>
        </div>
      </div>
    </div>
  );
}
