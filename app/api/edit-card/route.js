import { getSheet } from '@/lib/googleSheet';
import { NextResponse } from 'next/server';

export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, password, name, title, company, area_code, phone, is_whatsapp, email, linkedin, others, bio, avatar } = body;

    if (!id || !password) {
       return NextResponse.json({ error: 'Missing ID or Password' }, { status: 400 });
    }

    const sheet = await getSheet('User_Cards');
    await sheet.loadHeaderRow(); // Ensure headers are loaded
    const headers = sheet.headerValues;

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
    if (storedPassword !== password) {
         return NextResponse.json({ error: 'Incorrect Password' }, { status: 403 });
    }

    // Helper to find correct header
    const findHeader = (key) => {
        if (headers.includes(key)) return key;
        const normalizedKey = key.toLowerCase().replace(/_/g, '').replace(/ /g, '');
        return headers.find(h => h.toLowerCase().replace(/_/g, '').replace(/ /g, '') === normalizedKey);
    };

    const set = (key, val) => {
        const header = findHeader(key);
        if (header) row.set(header, val);
        // If no matching header found, we skip or try default. 
        // row.set requires a key that matches a header if using raw object? 
        // actually google-spreadsheet row.set(key, val) just updates the LOCAL object.
        // pass the exact header string is best.
    };

    // Update Data
    if (name) set('name', name);
    if (title) set('title', title);
    if (company) set('company', company);
    if (area_code) set('area_code', area_code);
    if (phone) set('phone', phone);
    if (is_whatsapp !== undefined) set('is_whatsapp', is_whatsapp ? 'TRUE' : 'FALSE');
    if (email) set('email', email);
    if (linkedin) set('linkedin', linkedin);
    if (others) set('others', others);
    if (bio) set('bio', bio);
    if (avatar) set('avatar', avatar);

    await row.save();

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error("Edit API Error:", error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
