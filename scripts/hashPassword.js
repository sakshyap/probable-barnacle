import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, '..', 'data', 'db.json');

const args = process.argv.slice(2);
const plainPassword = args[0] || 'admin123';
const shouldSave = args.includes('--save');

console.log('--------------------------------------------------');
console.log('  Admin Password Hash Generator (bcryptjs)');
console.log('--------------------------------------------------');
console.log(`Password to hash: "${plainPassword}"`);

const saltRounds = 10;
const hashedPassword = bcrypt.hashSync(plainPassword, saltRounds);

console.log('\nGenerated Bcrypt Hash:');
console.log(hashedPassword);
console.log('--------------------------------------------------');

if (shouldSave) {
  try {
    if (fs.existsSync(dbPath)) {
      const data = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
      if (data.admin) {
        data.admin.passwordHash = hashedPassword;
        fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf-8');
        console.log(`Successfully updated admin password in data/db.json!`);
      }
    }
  } catch (err) {
    console.error('Failed to update data/db.json:', err.message);
  }
} else {
  console.log('To update automatically in data/db.json, run:');
  console.log(`  node scripts/hashPassword.js "${plainPassword}" --save`);
  console.log('Or copy the hash above and paste it into data/db.json under admin.passwordHash');
}
console.log('--------------------------------------------------\n');
