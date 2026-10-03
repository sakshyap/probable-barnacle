/**
 * Creates (or updates) the first admin user in Supabase Auth.
 *
 * The email and password are never hardcoded. Supply them either way:
 *
 *   npm run seed -- --email you@example.com --password "Your@Passw0rd"
 *   ADMIN_EMAIL=... ADMIN_PASSWORD=... npm run seed
 *
 * Run `supabase/schema.sql` in the Supabase SQL Editor first - without the
 * tables the login will succeed but every data request will fail.
 */
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { getSupabase, checkSupabaseConnection } from '../data/supabase.js';

dotenv.config({
  path: path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '.env'),
  quiet: true
});

// ES module imports are hoisted, but data/supabase.js only touches process.env
// inside getSupabase() / checkSupabaseConnection(), so the dotenv.config() call
// above has already run by the time this script actually talks to Supabase.

function printUsage() {
  console.log(`
Supabase Admin Seeder
Creates (or updates) an admin user in Supabase Auth.

Usage:
  npm run seed -- --email admin@example.com --password "Admin@1234"
  node scripts/seedAdmin.js --email admin@example.com --password "Admin@1234"
  ADMIN_EMAIL=you@example.com ADMIN_PASSWORD=Admin@1234 npm run seed

Options:
  --email     Admin email address (or ADMIN_EMAIL)
  --password  Password, minimum 8 characters (or ADMIN_PASSWORD)
  --name      Display name stored in the profile (optional, defaults to the
              part of the email before "@")
  --list      List the existing Supabase users and exit
  --help      Show this message
`);
}

/**
 * Reads a flag in both the `--name=value` and the `--name value` form, so the
 * quoting rules of the user's shell never matter.
 */
function readArg(name) {
  const argv = process.argv.slice(2);
  const flag = `--${name}`;

  const inline = argv.find((arg) => arg.startsWith(`${flag}=`));
  if (inline) return inline.slice(flag.length + 1);

  const index = argv.indexOf(flag);
  if (index !== -1 && argv[index + 1] && !argv[index + 1].startsWith('--')) {
    return argv[index + 1];
  }

  return undefined;
}

/**
 * listUsers() is paginated (50 per page by default), so a project with more
 * users than that would otherwise "not contain" the admin we are looking for.
 */
async function findUserByEmail(supabase, email) {
  const PER_PAGE = 200;
  let page = 1;

  for (;;) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: PER_PAGE });
    if (error) throw new Error(error.message);

    const match = data?.users?.find((user) => user.email?.toLowerCase() === email);
    if (match) return match;

    if (!data?.users?.length || data.users.length < PER_PAGE) return null;
    page += 1;
  }
}

async function listUsers(supabase) {
  const { data, error } = await supabase.auth.admin.listUsers({ page: 1, perPage: 200 });
  if (error) throw new Error(error.message);

  if (!data.users.length) {
    console.log('No users exist yet. Run: npm run seed -- --email ... --password ...');
    return;
  }

  console.log('\nSupabase users:');
  for (const user of data.users) {
    console.log(`  ${user.email}  (${user.id})  confirmed: ${user.email_confirmed_at ? 'yes' : 'no'}`);
  }
  console.log('');
}

async function main() {
  if (process.argv.includes('--help') || process.argv.includes('-h')) {
    printUsage();
    return;
  }

  const health = await checkSupabaseConnection();
  if (!health.configured) {
    console.error(health.message);
    console.error('Add the values to your .env file (see .env.example) and try again.');
    process.exit(1);
  }
  if (!health.reachable) {
    console.error(health.message);
    process.exit(1);
  }

  const supabase = getSupabase();

  if (process.argv.includes('--list')) {
    await listUsers(supabase);
    return;
  }

  const email = (readArg('email') || process.env.ADMIN_EMAIL || '').trim().toLowerCase();
  const password = readArg('password') || process.env.ADMIN_PASSWORD || '';
  const name =
    (readArg('name') || process.env.ADMIN_NAME || '').trim() || email.split('@')[0] || 'Admin';

  if (!email || !password) {
    printUsage();
    console.error('Error: both an email and a password are required.');
    process.exit(1);
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    console.error(`Error: "${email}" is not a valid email address.`);
    process.exit(1);
  }

  if (password.length < 8) {
    console.error('Error: the password must be at least 8 characters long.');
    process.exit(1);
  }

  console.log(`Looking for an existing user with the email: ${email}`);
  const existing = await findUserByEmail(supabase, email);

  const metadata = { name, role: 'admin' };

  if (existing) {
    const { error } = await supabase.auth.admin.updateUserById(existing.id, {
      password,
      email_confirm: true,
      user_metadata: { ...existing.user_metadata, ...metadata }
    });

    if (error) {
      console.error('Failed to update the admin user:', error.message);
      process.exit(1);
    }

    console.log(`✔ Updated the existing admin: ${email} (${existing.id})`);
  } else {
    const { error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: metadata
    });

    if (error) {
      console.error('Failed to create the admin user:', error.message);
      process.exit(1);
    }

    console.log(`✔ Created the admin user: ${email}`);
  }

  console.log('');
  console.log('You can now sign in at:');
  console.log(`  http://localhost:${process.env.PORT || 3000}/portfolio-admin  (Portfolio Admin)`);
  console.log(`  http://localhost:${process.env.PORT || 3000}/admin           (Legacy Admin)`);
  console.log('');
  console.log('Change the password from inside the admin panel afterwards.');
}

main().catch((err) => {
  console.error('Seeding failed:', err.message);
  process.exit(1);
});
