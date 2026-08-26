import { getSupabaseClient, isSupabaseConfigured } from './supabase'

export async function uploadImageToSupabaseStorage(
  file: File,
  folder = 'projects'
): Promise<{ url: string | null; error?: string }> {
  try {
    if (!isSupabaseConfigured()) {
      return { url: null, error: 'Supabase credentials not configured' }
    }
    const client = getSupabaseClient()
    if (!client) return { url: null, error: 'Supabase client unavailable' }

    const fileExt = file.name.split('.').pop() || 'jpg'
    const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).slice(2)}.${fileExt}`

    // Upload image to Supabase Storage bucket 'portfolio-assets'
    const { data, error } = await client.storage
      .from('portfolio-assets')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true,
      })

    if (error) {
      console.warn('Supabase storage upload notice:', error.message)
      return { url: null, error: error.message }
    }

    // Generate public CDN URL
    const { data: publicUrlData } = client.storage.from('portfolio-assets').getPublicUrl(fileName)
    return { url: publicUrlData.publicUrl }
  } catch (err: any) {
    console.error('Supabase storage upload exception:', err)
    return { url: null, error: err.message || 'Storage upload failed' }
  }
}
