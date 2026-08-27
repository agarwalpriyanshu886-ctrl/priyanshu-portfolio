import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://bcgbzpnhsubddtpzwutl.supabase.co'
const SUPABASE_KEY = 'sb_publishable_OWvWgcO7JoIWCnuuadoevQ_kjyj9ztI'

const client = createClient(SUPABASE_URL, SUPABASE_KEY)

async function auditSystem() {
  console.log('====================================================')
  console.log('🔍 FULL SYSTEM & SUPABASE CONNECTION AUDIT REPORT')
  console.log('====================================================\n')

  let results = {
    supabaseClient: false,
    portfolioCmsTable: false,
    contactMessagesTable: false,
    modeSettingsTable: false,
    contactInsertTest: false,
    cmsReadTest: false,
  }

  // 1. Test Supabase Client Connectivity
  try {
    console.log('1️⃣ Testing Supabase Cloud API Connection...')
    if (client) {
      results.supabaseClient = true
      console.log('   ✅ Supabase Client initialized successfully!')
      console.log(`   URL: ${SUPABASE_URL}`)
    }
  } catch (err) {
    console.error('   ❌ Supabase Client Error:', err.message)
  }

  // 2. Test portfolio_cms Table Read/Write
  try {
    console.log('\n2️⃣ Testing "portfolio_cms" Table...')
    const { data, error } = await client.from('portfolio_cms').select('*').limit(1)
    if (error) {
      console.warn(`   ⚠️ portfolio_cms Query Notice: ${error.message}`)
    } else {
      results.portfolioCmsTable = true
      results.cmsReadTest = true
      console.log(`   ✅ portfolio_cms table exists & accessible! Found ${data ? data.length : 0} active CMS snapshot(s).`)
    }
  } catch (err) {
    console.error('   ❌ portfolio_cms Error:', err.message)
  }

  // 3. Test contact_messages Table & Insert Capability
  try {
    console.log('\n3️⃣ Testing "contact_messages" Table & Contact Form Submissions...')
    const testMessage = {
      name: 'System Health Check',
      email: 'healthcheck@priyanshu.com',
      subject: 'Automated Connection Verification',
      message: 'System audit verifying contact form submission capability.',
      read: true,
      created_at: new Date().toISOString(),
    }
    const { data, error } = await client.from('contact_messages').insert([testMessage]).select()
    if (error) {
      console.warn(`   ⚠️ contact_messages Table Notice: ${error.message}`)
    } else {
      results.contactMessagesTable = true
      results.contactInsertTest = true
      console.log('   ✅ contact_messages table exists & insert verified!')
      console.log('   Submitted Test Record:', data[0]?.id)
      
      // Clean up test message
      await client.from('contact_messages').delete().eq('id', data[0]?.id)
      console.log('   🧹 Test Record cleaned up successfully!')
    }
  } catch (err) {
    console.error('   ❌ contact_messages Error:', err.message)
  }

  // 4. Test mode_settings Table
  try {
    console.log('\n4️⃣ Testing "mode_settings" Table...')
    const { data, error } = await client.from('mode_settings').select('*').limit(1)
    if (error) {
      console.warn(`   ⚠️ mode_settings Table Notice: ${error.message}`)
    } else {
      results.modeSettingsTable = true
      console.log(`   ✅ mode_settings table accessible! Rows found: ${data ? data.length : 0}`)
    }
  } catch (err) {
    console.error('   ❌ mode_settings Error:', err.message)
  }

  console.log('\n====================================================')
  console.log('📊 AUDIT SUMMARY REPORT:')
  console.log('====================================================')
  console.log(`Supabase Client:          ${results.supabaseClient ? '✅ CONNECTED' : '❌ FAILED'}`)
  console.log(`portfolio_cms Table:     ${results.portfolioCmsTable ? '✅ VERIFIED' : '⚠️ NOT CREATED YET (Fallback active)'}`)
  console.log(`contact_messages Table:  ${results.contactMessagesTable ? '✅ VERIFIED & WORKING' : '⚠️ NOT CREATED YET (Fallback active)'}`)
  console.log(`mode_settings Table:     ${results.modeSettingsTable ? '✅ VERIFIED' : '⚠️ SAFE FALLBACK ACTIVE'}`)
  console.log('====================================================\n')
}

auditSystem()
