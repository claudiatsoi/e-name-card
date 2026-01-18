import { getSheet } from '@/lib/googleSheet';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { id, password } = body;

    if (!id || !password) {
       return NextResponse.json({ error: 'Missing ID or Password' }, { status: 400 });
    }

    const sheet = await getSheet('User_Cards');
    const rows = await sheet.getRows();
    
    // Find row with flexible ID header matching
    const getId = (r) => r.get('id') || r.get('ID') || r.get('Id') || '';
    const row = rows.find(r => getId(r) === id);

    if (!row) {
        return NextResponse.json({ error: 'Card not found' }, { status: 404 });
    }
    
    // Verify Password
    const getPassword = (r) => r.get('password') || r.get('Password') || r.get('PASSWORD') || '';
    const storedPassword = getPassword(row);
    // Simple string comparison. In a real app, use hashing.
    if (storedPassword !== password) {
         return NextResponse.json({ error: 'Incorrect Password' }, { status: 403 });
    }

    const get = (key) => row.get(key) || row.get(key.toLowerCase()) || row.get(key.toUpperCase()) || row.get(key.replace('_', ' ')) || '';

    // Return the card data
    const cardData = {
        name: get('name'),
        title: get('title'),
        company: get('company'),
        area_code: get('area_code'),
        phone: get('phone'),
        is_whatsapp: String(get('is_whatsapp')).toUpperCase() === 'TRUE',
        email: get('email'),
        linkedin: get('linkedin'),
        others: get('others'),
        bio: get('bio'),
        avatar: get('avatar'),
    };

    return NextResponse.json({ success: true, card: cardData });

  } catch (error) {
    console.error("Verify API Error:", error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
