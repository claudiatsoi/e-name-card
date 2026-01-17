const { getSheet } = require('./lib/googleSheet');
require('dotenv').config({ path: '.env.local' });

async function checkLastRow() {
    try {
        const sheet = await getSheet('User_Cards');
        const rows = await sheet.getRows();
        if (rows.length === 0) {
            console.log("No rows found.");
            return;
        }
        const lastRow = rows[rows.length - 1];
        console.log("Last Row Data:");
        console.log("ID:", lastRow.get('id'));
        console.log("Name:", lastRow.get('name'));
        console.log("Avatar (raw):", lastRow.get('avatar'));
        console.log("Avatar (Title Case):", lastRow.get('Avatar'));
        
        console.log("All headers:", sheet.headerValues);
    } catch (e) {
        console.error(e);
    }
}

checkLastRow();
