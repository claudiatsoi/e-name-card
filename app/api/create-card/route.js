import { getSheet } from '@/lib/googleSheet';
import { NextResponse } from 'next/server';

// Simple in-memory rate limiting (per server instance)
const rateLimit = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 60 seconds

export async function POST(request) {
  try {
    // Rate Limiting Check
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const now = Date.now();
    
    if (rateLimit.has(ip)) {
      const lastTime = rateLimit.get(ip);
      if (now - lastTime < RATE_LIMIT_WINDOW) {
         return NextResponse.json({ 
           error: 'Please wait 1 minute before creating another card.' 
         }, { status: 429 });
      }
    }
    rateLimit.set(ip, now);

    const body = await request.json();
    const { name, title, company, area_code, phone, is_whatsapp, email, linkedin, others, bio } = body;
    
    // Debug Auth
    console.log("Auth Email being used:", process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL);

    if (!name || !title || !company || !phone || !email) {
       return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const sheet = await getSheet('User_Cards');
    
    // Generate a simple unique ID
    const id = crypto.randomUUID().split('-')[0]; // Use first section of UUID for brevity
    const created_at = new Date().toISOString();
    const referred_by = body.referred_by || '';

    // Verify sheet loaded correctly
    if (!sheet) {
        throw new Error('Could not find User_Cards tab');
    }

    await sheet.addRow({
        id,
        name,
        title,
        company,
        area_code: area_code || '',
        phone,
        is_whatsapp: is_whatsapp ? 'TRUE' : 'FALSE',
        email,
        linkedin: linkedin || '',
        others: others || '',
        bio: bio || '',
        created_at,
        referred_by
    });

    return NextResponse.json({ id });
  } catch (error) {
    console.error("API Error Full Stack:", error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
