import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://bcgbzpnhsubddtpzwutl.supabase.co'
const SUPABASE_KEY = 'sb_publishable_OWvWgcO7JoIWCnuuadoevQ_kjyj9ztI'

const client = createClient(SUPABASE_URL, SUPABASE_KEY)

async function setupModeSettings() {
  console.log('⚡ Testing and populating mode_settings table in Supabase...')
  const defaultModeRow = {
    id: 'default',
    default_mode: 'DEVELOPER',
    enable_mode_persistence: true,
    intro_mode: 'FIRST_VISIT',
    transition_duration_ms: 1000,
  }

  const { data, error } = await client.from('mode_settings').upsert([defaultModeRow]).select()

  if (error) {
    console.error('❌ Table notice:', error.message)
  } else {
    console.log('✅ mode_settings table exists & populated:', data)
  }
}

setupModeSettings()
