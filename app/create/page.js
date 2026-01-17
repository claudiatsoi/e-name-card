'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';

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
    <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col font-display">
      {/* Top Navigation Bar */}
      <nav className="sticky top-0 z-30 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-[#dae5e7] dark:border-primary/20">
        <div className="flex items-center p-4 justify-between max-w-2xl mx-auto w-full">
            <div className="text-primary flex size-10 items-center justify-start cursor-pointer hover:bg-black/5 rounded-full" onClick={() => router.back()}>
                <span className="material-symbols-outlined">arrow_back_ios</span>
            </div>
            <h2 className="text-[#101818] dark:text-white text-lg font-bold tracking-tight flex-1 text-center">Create Card</h2>
             <div className="flex w-10 items-center justify-end"></div>
        </div>
      </nav>

      <main className="flex-1 flex flex-col w-full max-w-2xl mx-auto pb-32">
        {/* Live Preview Section */}
        <section className="p-6">
            <h4 className="text-primary text-[10px] font-extrabold leading-normal tracking-[0.2em] mb-4 text-center uppercase">Live Digital Preview</h4>
            {/* Text-based Minimalist Card */}
            <div className="preview-card-shadow bg-white dark:bg-white/5 border border-[#dae5e7] dark:border-primary/30 rounded p-8 min-h-[220px] flex flex-col justify-between transition-all duration-300">
                <div className="flex flex-col gap-1">
                    <span className="text-primary text-[11px] font-bold tracking-[0.15em] uppercase mb-1">{formData.title || 'Job Title'}</span>
                    <h1 className="text-[#101818] dark:text-white text-3xl font-extrabold tracking-tighter leading-none mb-2">{formData.name || 'Your Name'}</h1>
                    <p className="text-[#5e888d] dark:text-[#a0c4c8] text-sm font-medium leading-relaxed max-w-[280px]">{formData.company || 'Company Name'}</p>
                </div>
                <div className="mt-8 pt-6 border-t border-dashed border-[#dae5e7] dark:border-primary/20 flex flex-wrap gap-x-6 gap-y-2">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-[18px]">call</span>
                        <span className="text-[#101818] dark:text-white text-xs font-bold">{formData.phone ? (formData.area_code ? `+${formData.area_code} ${formData.phone}` : formData.phone) : 'Phone Number'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-[18px]">alternate_email</span>
                        <span className="text-[#101818] dark:text-white text-xs font-bold">{formData.email || 'email@example.com'}</span>
                    </div>
                </div>
            </div>
        </section>

        {/* Form Sections */}
        <form onSubmit={handleSubmit} className="flex-1 space-y-2">
            {/* IDENTITY Section */}
            <div className="bg-white dark:bg-white/5 py-4">
                <h3 className="text-[#101818] dark:text-white text-xs font-black leading-tight tracking-[0.15em] px-6 py-4 uppercase">Identity</h3>
                <div className="px-6 py-2">
                    <label className="flex flex-col w-full">
                        <p className="text-[#5e888d] dark:text-[#a0c4c8] text-[11px] font-bold uppercase tracking-wider pb-2">Full Name</p>
                        <input 
                            name="name" 
                            type="text" 
                            required 
                            className="w-full rounded-lg text-[#101818] dark:text-white focus:outline-0 focus:ring-1 focus:ring-primary border border-[#dae5e7] dark:border-primary/20 bg-background-light dark:bg-background-dark/40 h-12 placeholder:text-[#dae5e7] p-4 text-base font-normal transition-colors" 
                            placeholder="e.g. Alex Rivera" 
                            value={formData.name} 
                            onChange={handleChange}
                        />
                    </label>
                </div>
            </div>

            {/* PROFESSIONAL Section */}
            <div className="bg-white dark:bg-white/5 py-4">
                <h3 className="text-[#101818] dark:text-white text-xs font-black leading-tight tracking-[0.15em] px-6 py-4 uppercase">Professional</h3>
                <div className="flex flex-col sm:flex-row gap-2 px-6">
                    <label className="flex flex-col flex-1">
                        <p className="text-[#5e888d] dark:text-[#a0c4c8] text-[11px] font-bold uppercase tracking-wider pb-2">Job Title</p>
                        <input 
                            name="title" 
                            type="text" 
                            required 
                            className="w-full rounded-lg text-[#101818] dark:text-white focus:outline-0 focus:ring-1 focus:ring-primary border border-[#dae5e7] dark:border-primary/20 bg-background-light dark:bg-background-dark/40 h-12 placeholder:text-[#dae5e7] p-4 text-base font-normal" 
                            placeholder="e.g. Designer" 
                            value={formData.title} 
                            onChange={handleChange}
                        />
                    </label>
                    <label className="flex flex-col flex-1 mt-4 sm:mt-0">
                        <p className="text-[#5e888d] dark:text-[#a0c4c8] text-[11px] font-bold uppercase tracking-wider pb-2">Company</p>
                        <input 
                            name="company" 
                            type="text" 
                            required 
                            className="w-full rounded-lg text-[#101818] dark:text-white focus:outline-0 focus:ring-1 focus:ring-primary border border-[#dae5e7] dark:border-primary/20 bg-background-light dark:bg-background-dark/40 h-12 placeholder:text-[#dae5e7] p-4 text-base font-normal" 
                            placeholder="Company Name" 
                            value={formData.company} 
                            onChange={handleChange}
                        />
                    </label>
                </div>
            </div>

             {/* CONNECTIVITY Section */}
            <div className="bg-white dark:bg-white/5 py-4">
                <h3 className="text-[#101818] dark:text-white text-xs font-black leading-tight tracking-[0.15em] px-6 py-4 uppercase">Connectivity</h3>
                <div className="px-6 space-y-4">
                    <label className="flex flex-col w-full">
                         <p className="text-[#5e888d] dark:text-[#a0c4c8] text-[11px] font-bold uppercase tracking-wider pb-2">Phone</p>
                         <div className="flex gap-2">
                             <input 
                                name="area_code" 
                                type="text" 
                                placeholder="852"
                                className="w-20 rounded-lg text-[#101818] dark:text-white focus:outline-0 focus:ring-1 focus:ring-primary border border-[#dae5e7] dark:border-primary/20 bg-background-light dark:bg-background-dark/40 h-12 placeholder:text-[#dae5e7] p-4 text-base font-normal" 
                                value={formData.area_code} 
                                onChange={handleChange}
                             />
                             <input 
                                name="phone" 
                                type="tel" 
                                required 
                                className="flex-1 rounded-lg text-[#101818] dark:text-white focus:outline-0 focus:ring-1 focus:ring-primary border border-[#dae5e7] dark:border-primary/20 bg-background-light dark:bg-background-dark/40 h-12 placeholder:text-[#dae5e7] p-4 text-base font-normal" 
                                placeholder="Phone Number" 
                                value={formData.phone} 
                                onChange={handleChange}
                             />
                         </div>
                    </label>
                    
                    <label className="flex items-center gap-2">
                        <input
                            id="is_whatsapp"
                            name="is_whatsapp"
                            type="checkbox"
                            className="h-4 w-4 text-primary focus:ring-primary border-[#dae5e7] rounded"
                            checked={formData.is_whatsapp}
                            onChange={handleChange}
                        />
                        <span className="text-sm text-[#101818] dark:text-white">Enable WhatsApp Chat</span>
                    </label>

                    <label className="flex flex-col w-full">
                        <p className="text-[#5e888d] dark:text-[#a0c4c8] text-[11px] font-bold uppercase tracking-wider pb-2">Email</p>
                        <input 
                            name="email" 
                            type="email" 
                            required 
                            className="w-full rounded-lg text-[#101818] dark:text-white focus:outline-0 focus:ring-1 focus:ring-primary border border-[#dae5e7] dark:border-primary/20 bg-background-light dark:bg-background-dark/40 h-12 placeholder:text-[#dae5e7] p-4 text-base font-normal" 
                            placeholder="Email Address" 
                            value={formData.email} 
                            onChange={handleChange}
                        />
                    </label>
                </div>
            </div>

            {status === 'error' && (
             <p className="text-red-500 text-center text-sm px-6">
               Error: {errorMsg}
             </p>
            )}
        </form>
      </main>

      {/* Fixed Footer Action */}
        <footer className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background-light dark:from-background-dark via-background-light dark:via-background-dark to-transparent pt-12 z-40">
            <div className="max-w-2xl mx-auto flex flex-col gap-4">
                <button 
                    onClick={handleSubmit}
                    disabled={status === 'loading'}
                    className="w-full bg-primary hover:bg-[#005a63] text-white py-4 rounded shadow-lg shadow-primary/20 text-sm font-bold tracking-[0.1em] uppercase transition-all active:scale-[0.98] disabled:opacity-50"
                >
                    {status === 'loading' ? 'Creating...' : 'Save Card'}
                </button>
                 <div className="text-[10px] text-gray-300 font-medium tracking-widest uppercase text-center">
                   Powered by Claudia Tsoi
                </div>
            </div>
        </footer>
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
