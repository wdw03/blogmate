const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://xnloveaollypxurdschq.supabase.co';
const supabaseKey = 'sb_publishable_XahWpgpMtZC7p336jQP1Nw_OA-LfF1P';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
  global: { fetch: fetch }
});

async function main() {
  console.log("Attempting login...");
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'savanop30@gmail.com',
    password: 'Kumar@123',
  });
  if (error) {
    console.error("Login Error:", error.message);
  } else {
    console.log("Login Success! User ID:", data.user.id);
  }
}
main();
