import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://bcgbzpnhsubddtpzwutl.supabase.co'
const SUPABASE_KEY = 'sb_publishable_OWvWgcO7JoIWCnuuadoevQ_kjyj9ztI'

const client = createClient(SUPABASE_URL, SUPABASE_KEY)

async function setupModeSettingsTable() {
  console.log('⚡ Checking Supabase table "mode_settings"...')

  try {
    const { data, error } = await client.from('mode_settings').select('*').limit(1)

    if (error) {
      console.log('ℹ️ Table mode_settings check result:', error.message)
    } else {
      console.log('✅ Table "mode_settings" exists and returned data!')
    }
  } catch (err) {
    console.warn('Error checking mode_settings:', err)
  }
}

setupModeSettingsTable()
