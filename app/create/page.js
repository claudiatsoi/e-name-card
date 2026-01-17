'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function CreateCardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const referredBy = searchParams.get('ref') || '';
  
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    company: '',
    phone: '',
    area_code: '',
    is_whatsapp: false,
    email: '',
  });
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    try {
      const payload = {
        ...formData,
        referred_by: referredBy
      };

      const res = await fetch('/api/create-card', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
         throw new Error(data.error || 'Failed to create card'); 
      }

      router.push(`/user/${data.id}?new=true`);
    } catch (error) {
      console.error(error);
      setStatus('error');
      setErrorMsg(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white shadow-lg rounded-xl w-full max-w-md p-8">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Create Your Card</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input 
              name="name" type="text" required 
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={formData.name} onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input 
              name="title" type="text" required 
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={formData.title} onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Company</label>
            <input 
              name="company" type="text" required 
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={formData.company} onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <div className="flex gap-2">
                <input 
                  name="area_code" type="text" placeholder="852"
                  className="mt-1 block w-20 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={formData.area_code} onChange={handleChange}
                />
                <input 
                  name="phone" type="tel" required placeholder="Phone Number"
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={formData.phone} onChange={handleChange}
                />
            </div>
            <div className="mt-2 flex items-center">
                <input
                    id="is_whatsapp"
                    name="is_whatsapp"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    checked={formData.is_whatsapp}
                    onChange={handleChange}
                />
                <label htmlFor="is_whatsapp" className="ml-2 block text-sm text-gray-900">
                    Is this a WhatsApp number?
                </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input 
              name="email" type="email" required 
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={formData.email} onChange={handleChange}
            />
          </div>
          
           {/* Visual indicator for referral, purely informational or hidden */}
          {referredBy && (
            <div className="text-xs text-center text-gray-400">
               Referred by: {referredBy}
            </div>
          )}

          <button 
            type="submit" 
            disabled={status === 'loading'}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400"
          >
            {status === 'loading' ? 'Creating...' : 'Create Card'}
          </button>
          
          {status === 'error' && (
             <p className="text-red-500 text-center text-sm">
               Error: {errorMsg}
             </p>
          )}
        </form>
      </div>
    </div>
  );
}

export default function CreateCard() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>}>
      <CreateCardContent />
    </Suspense>
  );
}
