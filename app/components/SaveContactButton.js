'use client';

export default function SaveContactButton({ name, company, title, phone, email, className, variant, cardTitle, cardSubtitle }) {
  const handleSave = () => {
    // Split name efficiently for vCard "N" field (Family Name; Given Name; ...)
    const parts = name ? name.trim().split(' ') : [];
    const lastName = parts.length > 1 ? parts.pop() : '';
    const firstName = parts.join(' ');
    // If only one name, put it in key name properties
    const finalFirstName = firstName || name; 
    const finalLastName = lastName;

    const vCardData = `BEGIN:VCARD
VERSION:3.0
N:${finalLastName};${finalFirstName};;;
FN:${name}
ORG:${company}
TITLE:${title}
TEL;TYPE=CELL:${phone}
EMAIL:${email}
END:VCARD`;

    const blob = new Blob([vCardData], { type: 'text/vcard' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${name.replace(/\s+/g, '_')}.vcf`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (variant === 'card') {
    return (
       <button onClick={handleSave} className="flex flex-1 gap-4 rounded-xl border border-black/5 bg-white p-5 flex-col whisper-shadow active:bg-primary/5 transition-colors cursor-pointer text-left w-full h-full hover:shadow-md">
          <div className="text-primary bg-primary/10 size-10 rounded-lg flex items-center justify-center">
             <span className="material-symbols-outlined">person_add</span>
          </div>
          <div className="flex flex-col gap-0.5">
             <h2 className="text-[#121517] text-base font-bold leading-tight">{cardTitle || 'Save Contact'}</h2>
             <p className="text-[#657b86] text-xs font-normal leading-normal">{cardSubtitle || 'Download vCard'}</p>
          </div>
       </button>
    );
  }

  return (
    <button
      onClick={handleSave}
      className={className || "w-full bg-blue-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300 mb-2 text-sm shadow-sm"}
    >
        {className ? (
             <>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                Save Contact
             </>
        ) : 'Save Contact'}
    </button>
  );
}
