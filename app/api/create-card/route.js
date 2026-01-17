import { getSheet } from '@/lib/googleSheet';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, title, company, phone, email } = body;
    
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
        phone,
        email,
        created_at,
        referred_by
    });

    return NextResponse.json({ id });
  } catch (error) {
    console.error("API Error Full Stack:", error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
