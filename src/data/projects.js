// Add or remove projects here. Cards render automatically.
// Category options: 'ai' | 'web' | 'mobile' | 'other'
// For `image`: either { from, to } gradient stops, or a full image URL.
export const projectCategories = [
  { id: 'all', label: 'All' },
  { id: 'ai', label: 'AI/ML' },
  { id: 'web', label: 'Web' },
  { id: 'mobile', label: 'Mobile' },
  { id: 'other', label: 'Other' },
]

export const projects = [
  {
    id: 'agarwals-chopati-web',
    title: 'Agarwals Chopati',
    description:
      'A modern restaurant website with menu management, gallery submissions, customer reviews and a full admin dashboard.',
    image: { url: '/projects/agarwals-chopati.png' },
    tech: ['React', 'Vite', 'Supabase', 'JavaScript'],
    category: 'web',
    github: 'https://github.com/agarwalpriyanshu886-ctrl',
    demo: 'https://agarwalschopati.vercel.app',
    featured: true,
  },
  {
    id: 'agarwals-chopati-app',
    title: 'Agarwals Chopati Android App',
    description:
      'A restaurant mobile application with a modern, customer-focused UI built for fast ordering and browsing.',
    image: { from: '#f59e0b', to: '#ef4444' },
    tech: ['Kotlin', 'Jetpack Compose', 'Firebase'],
    category: 'mobile',
    github: 'https://github.com/',
    demo: 'https://example.com',
    featured: true,
  },
  {
    id: 'placeholder-1',
    title: 'Next Project',
    description:
      'Your next project will live here. Add a title, description, technologies and links in src/data/projects.js.',
    image: { from: '#0ea5e9', to: '#6366f1' },
    tech: ['Your', 'Tech', 'Stack'],
    category: 'ai',
    isPlaceholder: true,
  },
  {
    id: 'placeholder-2',
    title: 'Upcoming Build',
    description:
      'Another project slot ready to be filled. Update the config file and it appears instantly.',
    image: { from: '#10b981', to: '#22d3ee' },
    tech: ['Your', 'Tech', 'Stack'],
    category: 'web',
    isPlaceholder: true,
  },
]
