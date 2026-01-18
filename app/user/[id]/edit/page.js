'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';

const AREA_CODES = [
  { value: '852', label: '+852 (HK)' },
  { value: '86', label: '+86 (CN)' },
  { value: '853', label: '+853 (MO)' },
  { value: '886', label: '+886 (TW)' },
  { value: '65', label: '+65 (SG)' },
  { value: '81', label: '+81 (JP)' },
  { value: '82', label: '+82 (KR)' },
  { value: '1', label: '+1 (US/CA)' },
  { value: '44', label: '+44 (UK)' },
  { value: '61', label: '+61 (AU)' },
];

function EditCardContent() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [authError, setAuthError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    title: '',
    company: '',
    phone: '',
    area_code: '852',
    is_whatsapp: false,
    email: '',
    linkedin: '',
    booking_url: '',
    others: '',
    bio: '',
    avatar: '',
  });

  // Load existing data once authenticated? 
  // For security, we can't load data until password is verify.
  // But our API doesn't expose a "fetch-with-password" endpoint yet, 
  // apart from just verifying the update.
  // Actually, the card data IS PUBLIC at /user/[id]. 
  // So we CAN fetch the data to pre-fill the form even before password.
  // The password is practically only needed to SAVE.
  // HOWEVER, for UX, let's ask for password first.
  
  // Actually, to pre-fill, we need the data. Let's fetch the public user data.
  useEffect(() => {
     // Fetch public data to pre-fill
     // Since this is a client component, we can just scrape our own API or pass props?
     // We don't have a GET JSON API for card details yet, only the page HTML.
     // Let's rely on the user filling it out? No, "edit" implies pre-fill.
     // I need a way to get the data.
     // Let's keep it simple: Ask for password first. If correct, we can fetch data securely?
     // OR... just fetch the data because it IS public.
  }, []);
  
  // Wait, I can't easily fetch the data from client side without a GET API.
  // I'll make a server action or API route to get data?
  // Let's assume the user knows their data or we just let them "Edit" blindly? No.
  
  // Real Solution: 
  // 1. Ask for password.
  // 2. If correct, API returns the data payload to populate the form.
  
  const handleLogin = async (e) => {
      e.preventDefault();
      setVerifying(true);
      setAuthError('');
      
      try {
          // I need an endpoint to verify password AND return data
          // I'll abuse checks.
          // Let's add a GET endpoint or use a server action?
          // I will make a POST verify endpoint
          const res = await fetch('/api/verify-card', {
              method: 'POST',
              body: JSON.stringify({ id, password: passwordInput })
          });
          const data = await res.json();
          if (res.ok) {
              setFormData({ ...data.card, password: passwordInput }); // Keep password for submit
              setIsAuthenticated(true);
          } else {
              setAuthError(data.error || 'Incorrect Password');
          }
      } catch (err) {
          setAuthError('Verification failed');
      } finally {
          setVerifying(false);
      }
  };

  const [status, setStatus] = useState('idle');
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const urlRegex = /^https?:\/\/.+/i;

    if (!formData.name.trim()) errors.name = 'Full Name is required';
    if (!formData.title.trim()) errors.title = 'Job Title is required';
    if (!formData.company.trim()) errors.company = 'Company Name is required';
    if (!formData.phone.trim()) errors.phone = 'Phone Number is required';
    
    if (!formData.email.trim()) {
        errors.email = 'Email Address is required';
    } else if (!emailRegex.test(formData.email)) {
        errors.email = 'Please enter a valid email address';
    }

    if (formData.linkedin && !urlRegex.test(formData.linkedin)) {
        errors.linkedin = 'URL must start with http:// or https://';
    }

    if (formData.booking_url && !urlRegex.test(formData.booking_url)) {
        errors.booking_url = 'URL must start with http:// or https://';
    }
    
    if (formData.others && !urlRegex.test(formData.others)) {
        errors.others = 'URL must start with http:// or https://';
    }

    return errors;
  };

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
     if (fieldErrors[e.target.name]) {
        setFieldErrors(prev => ({ ...prev, [e.target.name]: null }));
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

     if (file.size > 2 * 1024 * 1024) {
        alert("File size too large! Please upload an image smaller than 2MB.");
        return;
    }

    setUploading(true);
    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', 'e-name-card');
    data.append('cloud_name', 'du9br1qnu');

    try {
      const res = await fetch('https://api.cloudinary.com/v1_1/du9br1qnu/image/upload', {
        method: 'POST',
        body: data,
      });
      const image = await res.json();
      if (image.secure_url) {
        setFormData(prev => ({ ...prev, avatar: image.secure_url }));
      }
    } catch (err) {
      console.error('Upload failed', err);
      setErrorMsg('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
        setFieldErrors(errors);
        const firstErrorKey = Object.keys(errors)[0];
        const element = document.getElementsByName(firstErrorKey)[0];
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            element.focus();
        }
        return;
    }

    setStatus('loading');
    setErrorMsg('');

    try {
      const payload = { ...formData, id, password: passwordInput }; // Ensure ID/Pass are sent
      const res = await fetch('/api/edit-card', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
         throw new Error(data.error || 'Failed to update card'); 
      }

      router.push(`/user/${id}?updated=true`);
    } catch (error) {
      console.error(error);
      setStatus('error');
      setErrorMsg(error.message);
    }
  };

  if (!isAuthenticated) {
      return (
          <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center p-6 font-display">
              <div className="w-full max-w-sm bg-white dark:bg-white/5 p-8 rounded-xl shadow-lg border border-[#dae5e7] dark:border-white/10">
                  <h1 className="text-2xl font-bold text-[#121517] dark:text-white mb-2 text-center">Edit Card</h1>
                  <p className="text-[#657b86] text-sm text-center mb-6">Enter your 6-character password to verify.</p>
                  
                  <form onSubmit={handleLogin} className="space-y-4">
                      <input 
                          type="text" 
                          placeholder="Password / PIN" 
                          className="w-full h-12 rounded-lg border border-[#dae5e7] p-4 text-center tracking-widest text-lg font-bold uppercase"
                          value={passwordInput}
                          onChange={(e) => setPasswordInput(e.target.value)}
                          maxLength={6}
                      />
                      {authError && <p className="text-red-500 text-sm text-center">{authError}</p>}
                      <button 
                          type="submit"
                          disabled={verifying}
                          className="w-full bg-primary text-white h-12 rounded-lg font-bold uppercase tracking-wider"
                      >
                          {verifying ? 'Verifying...' : 'Access Editor'}
                      </button>
                  </form>
                  <button onClick={() => router.back()} className="w-full text-center text-[#657b86] text-xs mt-4 hover:underline">Cancel</button>
              </div>
          </div>
      )
  }

  // Reusing the create form layout for consistency
  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col font-display">
       <nav className="sticky top-0 z-30 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-[#dae5e7] dark:border-primary/20">
        <div className="flex items-center p-4 justify-between max-w-2xl mx-auto w-full">
            <div className="text-primary flex size-10 items-center justify-start cursor-pointer" onClick={() => router.push(`/user/${id}`)}>
                <span className="material-symbols-outlined">close</span>
            </div>
            <h2 className="text-[#121517] dark:text-white text-lg font-bold tracking-tight flex-1 text-center">Edit Details</h2>
             <div className="flex w-10 items-center justify-end"></div>
        </div>
      </nav>

       <main className="flex-1 flex flex-col w-full max-w-2xl mx-auto pb-32">
        <form onSubmit={handleSubmit} className="flex-1 space-y-2 mt-4">
            {/* Form Fields (Copied from Create for Consistency) */}
             <div className="bg-white dark:bg-white/5 py-4">
                <h3 className="text-[#101818] dark:text-white text-xs font-black leading-tight tracking-[0.15em] px-6 py-4 uppercase">Identity</h3>
                <div className="px-6 py-2">
                    <label className="flex flex-col w-full">
                        <p className="text-[#5e888d] dark:text-[#a0c4c8] text-[11px] font-bold uppercase tracking-wider pb-2">Full Name</p>
                        <input 
                            name="name" 
                            type="text" 
                            required 
                            className={`w-full rounded-lg text-[#101818] dark:text-white focus:outline-0 focus:ring-1 focus:ring-primary border ${fieldErrors.name ? 'border-red-500 focus:ring-red-500' : 'border-[#dae5e7] dark:border-primary/20'} bg-background-light dark:bg-background-dark/40 h-12 placeholder:text-[#dae5e7] p-4 text-base font-normal transition-colors`}
                            value={formData.name} 
                            onChange={handleChange}
                        />
                         {fieldErrors.name && <p className="text-red-500 text-xs mt-1 font-medium animate-pulse">{fieldErrors.name}</p>}
                    </label>

                    <label className="flex flex-col w-full mt-4">
                        <p className="text-[#5e888d] dark:text-[#a0c4c8] text-[11px] font-bold uppercase tracking-wider pb-2">Profile Picture</p>
                        <div className="flex items-center gap-4">
                            {formData.avatar && (
                                <div className="relative w-12 h-12 rounded-full overflow-hidden border border-[#dae5e7]">
                                    <Image src={formData.avatar} alt="Preview" fill className="object-cover" unoptimized />
                                </div>
                            )}
                            <label className={`flex items-center justify-center h-12 px-4 rounded-lg border border-[#dae5e7] dark:border-primary/20 bg-background-light dark:bg-background-dark/40 cursor-pointer hover:bg-black/5 transition-colors ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                <span className="text-[#101818] dark:text-white text-sm font-medium">
                                    {uploading ? 'Uploading...' : 'Change Photo'}
                                </span>
                                <input 
                                    type="file" 
                                    accept="image/*"
                                    className="hidden"
                                    disabled={uploading}
                                    onChange={handleImageUpload}
                                />
                            </label>
                        </div>
                    </label>
                </div>
            </div>

            <div className="bg-white dark:bg-white/5 py-4">
                <h3 className="text-[#101818] dark:text-white text-xs font-black leading-tight tracking-[0.15em] px-6 py-4 uppercase">Professional</h3>
                <div className="flex flex-col sm:flex-row gap-2 px-6">
                    <label className="flex flex-col flex-1">
                        <p className="text-[#5e888d] dark:text-[#a0c4c8] text-[11px] font-bold uppercase tracking-wider pb-2">Job Title</p>
                        <input 
                            name="title" 
                            type="text" 
                            required 
                            className={`w-full rounded-lg text-[#101818] dark:text-white focus:outline-0 focus:ring-1 focus:ring-primary border ${fieldErrors.title ? 'border-red-500 focus:ring-red-500' : 'border-[#dae5e7] dark:border-primary/20'} bg-background-light dark:bg-background-dark/40 h-12 placeholder:text-[#dae5e7] p-4 text-base font-normal`}
                            value={formData.title} 
                            onChange={handleChange}
                        />
                         {fieldErrors.title && <p className="text-red-500 text-xs mt-1 font-medium animate-pulse">{fieldErrors.title}</p>}
                    </label>
                    <label className="flex flex-col flex-1 mt-4 sm:mt-0">
                        <p className="text-[#5e888d] dark:text-[#a0c4c8] text-[11px] font-bold uppercase tracking-wider pb-2">Company</p>
                        <input 
                            name="company" 
                            type="text" 
                            required 
                             className={`w-full rounded-lg text-[#101818] dark:text-white focus:outline-0 focus:ring-1 focus:ring-primary border ${fieldErrors.company ? 'border-red-500 focus:ring-red-500' : 'border-[#dae5e7] dark:border-primary/20'} bg-background-light dark:bg-background-dark/40 h-12 placeholder:text-[#dae5e7] p-4 text-base font-normal`}
                            value={formData.company} 
                            onChange={handleChange}
                        />
                         {fieldErrors.company && <p className="text-red-500 text-xs mt-1 font-medium animate-pulse">{fieldErrors.company}</p>}
                    </label>
                </div>
            </div>

            <div className="bg-white dark:bg-white/5 py-4">
                <h3 className="text-[#101818] dark:text-white text-xs font-black leading-tight tracking-[0.15em] px-6 py-4 uppercase">Connectivity</h3>
                <div className="px-6 space-y-4">
                    <label className="flex flex-col w-full">
                         <p className="text-[#5e888d] dark:text-[#a0c4c8] text-[11px] font-bold uppercase tracking-wider pb-2">Phone</p>
                         <div className="flex gap-2">
                             <select 
                                name="area_code" 
                                required
                                className="w-32 rounded-lg text-[#101818] dark:text-white focus:outline-0 focus:ring-1 focus:ring-primary border border-[#dae5e7] dark:border-primary/20 bg-background-light dark:bg-background-dark/40 h-12 px-4 text-base font-normal"
                                value={formData.area_code} 
                                onChange={handleChange}
                             >
                                {AREA_CODES.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                             </select>
                             <input 
                                name="phone" 
                                type="tel" 
                                required 
                                className={`flex-1 rounded-lg text-[#101818] dark:text-white focus:outline-0 focus:ring-1 focus:ring-primary border ${fieldErrors.phone ? 'border-red-500 focus:ring-red-500' : 'border-[#dae5e7] dark:border-primary/20'} bg-background-light dark:bg-background-dark/40 h-12 placeholder:text-[#dae5e7] p-4 text-base font-normal`}
                                value={formData.phone} 
                                onChange={handleChange}
                             />
                         </div>
                          {fieldErrors.phone && <p className="text-red-500 text-xs mt-1 font-medium animate-pulse">{fieldErrors.phone}</p>}
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
                             className={`w-full rounded-lg text-[#101818] dark:text-white focus:outline-0 focus:ring-1 focus:ring-primary border ${fieldErrors.email ? 'border-red-500 focus:ring-red-500' : 'border-[#dae5e7] dark:border-primary/20'} bg-background-light dark:bg-background-dark/40 h-12 placeholder:text-[#dae5e7] p-4 text-base font-normal`}
                            value={formData.email} 
                            onChange={handleChange}
                        />
                         {fieldErrors.email && <p className="text-red-500 text-xs mt-1 font-medium animate-pulse">{fieldErrors.email}</p>}
                    </label>

                    <label className="flex flex-col w-full">
                        <p className="text-[#5e888d] dark:text-[#a0c4c8] text-[11px] font-bold uppercase tracking-wider pb-2">LinkedIn (Optional)</p>
                        <input 
                            name="linkedin" 
                            type="url" 
                             className={`w-full rounded-lg text-[#101818] dark:text-white focus:outline-0 focus:ring-1 focus:ring-primary border ${fieldErrors.linkedin ? 'border-red-500 focus:ring-red-500' : 'border-[#dae5e7] dark:border-primary/20'} bg-background-light dark:bg-background-dark/40 h-12 placeholder:text-[#dae5e7] p-4 text-base font-normal`}
                            value={formData.linkedin} 
                            onChange={handleChange}
                        />
                         {fieldErrors.linkedin && <p className="text-red-500 text-xs mt-1 font-medium animate-pulse">{fieldErrors.linkedin}</p>}
                    </label>

                    <label className="flex flex-col w-full">
                        <p className="text-[#5e888d] dark:text-[#a0c4c8] text-[11px] font-bold uppercase tracking-wider pb-2">Booking / Meeting URL (Optional)</p>
                        <input 
                            name="booking_url" 
                            type="url" 
                             className={`w-full rounded-lg text-[#101818] dark:text-white focus:outline-0 focus:ring-1 focus:ring-primary border ${fieldErrors.booking_url ? 'border-red-500 focus:ring-red-500' : 'border-[#dae5e7] dark:border-primary/20'} bg-background-light dark:bg-background-dark/40 h-12 placeholder:text-[#dae5e7] p-4 text-base font-normal`}
                            value={formData.booking_url} 
                            onChange={handleChange}
                        />
                         {fieldErrors.booking_url && <p className="text-red-500 text-xs mt-1 font-medium animate-pulse">{fieldErrors.booking_url}</p>}
                    </label>

                    <label className="flex flex-col w-full">
                        <p className="text-[#5e888d] dark:text-[#a0c4c8] text-[11px] font-bold uppercase tracking-wider pb-2">Other URL (Optional)</p>
                        <input 
                            name="others" 
                            type="url" 
                             className={`w-full rounded-lg text-[#101818] dark:text-white focus:outline-0 focus:ring-1 focus:ring-primary border ${fieldErrors.others ? 'border-red-500 focus:ring-red-500' : 'border-[#dae5e7] dark:border-primary/20'} bg-background-light dark:bg-background-dark/40 h-12 placeholder:text-[#dae5e7] p-4 text-base font-normal`}
                            value={formData.others} 
                            onChange={handleChange}
                        />
                         {fieldErrors.others && <p className="text-red-500 text-xs mt-1 font-medium animate-pulse">{fieldErrors.others}</p>}
                    </label>

                    <label className="flex flex-col w-full">
                        <p className="text-[#5e888d] dark:text-[#a0c4c8] text-[11px] font-bold uppercase tracking-wider pb-2">Bio (Optional)</p>
                        <textarea 
                            name="bio"
                            className="w-full rounded-lg text-[#101818] dark:text-white focus:outline-0 focus:ring-1 focus:ring-primary border border-[#dae5e7] dark:border-primary/20 bg-background-light dark:bg-background-dark/40 h-24 placeholder:text-[#dae5e7] p-4 text-base font-normal resize-none" 
                            placeholder="A short bio about yourself..." 
                            value={formData.bio} 
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

        <footer className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background-light dark:from-background-dark via-background-light dark:via-background-dark to-transparent pt-12 z-40">
            <div className="max-w-2xl mx-auto flex flex-col gap-4">
                <button 
                    onClick={handleSubmit}
                    disabled={status === 'loading'}
                    className="w-full bg-primary hover:bg-[#005a63] text-white py-4 rounded shadow-lg shadow-primary/20 text-sm font-bold tracking-[0.1em] uppercase transition-all active:scale-[0.98] disabled:opacity-50"
                >
                    {status === 'loading' ? 'Saving...' : 'Update Card'}
                </button>
            </div>
        </footer>
       </main>
    </div>
  );
}

export default function EditCard() {
  return (
      <EditCardContent />
  );
}
