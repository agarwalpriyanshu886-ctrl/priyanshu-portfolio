import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://bcgbzpnhsubddtpzwutl.supabase.co'
const SUPABASE_KEY = 'sb_publishable_OWvWgcO7JoIWCnuuadoevQ_kjyj9ztI'

const client = createClient(SUPABASE_URL, SUPABASE_KEY)

async function setupResumeStorage() {
  console.log('⚡ Checking Supabase Storage bucket "resumes"...')

  try {
    const { data: buckets, error: getBucketsError } = await client.storage.listBuckets()
    if (getBucketsError) {
      console.warn('⚠️ Bucket list notice:', getBucketsError.message)
    } else {
      const exists = buckets.some((b) => b.name === 'resumes')
      if (exists) {
        console.log('✅ Supabase Storage bucket "resumes" exists and is ready!')
      } else {
        console.log('ℹ️ Attempting to create public storage bucket "resumes"...')
        const { data, error } = await client.storage.createBucket('resumes', {
          public: true,
          fileSizeLimit: 10485760,
          allowedMimeTypes: ['application/pdf'],
        })
        if (error) {
          console.warn('⚠️ Storage bucket creation notice:', error.message)
        } else {
          console.log('✅ Storage bucket "resumes" created successfully!')
        }
      }
    }
  } catch (err) {
    console.warn('Storage check notice:', err.message)
  }
}

setupResumeStorage()
