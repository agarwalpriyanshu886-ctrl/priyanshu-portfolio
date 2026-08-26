import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://bcgbzpnhsubddtpzwutl.supabase.co'
const SUPABASE_KEY = 'sb_publishable_OWvWgcO7JoIWCnuuadoevQ_kjyj9ztI'

const client = createClient(SUPABASE_URL, SUPABASE_KEY)

async function testContactTable() {
  console.log('📬 Testing contact_messages table in Supabase...')
  const testMessage = {
    name: 'Priyanshu Test',
    email: 'test@priyanshu.com',
    subject: 'Initial Portfolio Connection Test',
    message: 'Hello! This is a test message to verify the contact form Supabase connection.',
    read: false,
    created_at: new Date().toISOString(),
  }

  const { data, error } = await client.from('contact_messages').insert([testMessage]).select()

  if (error) {
    console.error('❌ Table insert error:', error.message)
  } else {
    console.log('✅ contact_messages table exists and working! Inserted test row:', data)
  }
}

testContactTable()
