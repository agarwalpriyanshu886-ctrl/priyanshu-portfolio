export interface PublicAIKnowledge {
  profile: {
    name: string
    title: string
    roles: string[]
    bio: string[]
    passions: string[]
    contactEmail: string
    contactPhone: string
    location: string
    github: string
    linkedin: string
    instagram: string
  }
  education: Array<{
    id: string
    degree: string
    field: string
    institution: string
    location: string
    duration: string
    years: string
    badge: string
    description: string
    highlights: string[]
  }>
  projects: Array<{
    id: string
    title: string
    category: string
    shortDescription: string
    fullDescription: string
    techStack: string[]
    liveDemoUrl?: string
    githubUrl?: string
    developerHighlights?: string[]
    creativeHighlights?: string[]
  }>
  skills: {
    tech: string[]
    creative: string[]
  }
  algorithmsAndCS: Array<{
    category: string
    topics: string[]
    explanation: string
  }>
  faqs: Array<{
    question: string
    answer: string
  }>
  allowedTopics: string[]
  restrictedTopics: string[]
}

export const PUBLIC_AI_KNOWLEDGE: PublicAIKnowledge = {
  profile: {
    name: 'Priyanshu Agarwal',
    title: 'AI/ML Engineer & Full-Stack Developer',
    roles: ['AI/ML Engineer', 'Full-Stack Developer', 'Graphic Designer', 'Video Editor', 'Visual Artist'],
    bio: [
      'Priyanshu Agarwal is an engineering student pursuing an integrated B.Tech + M.Tech in Artificial Intelligence & Machine Learning at NIMS University Jaipur.',
      'He combines software & AI engineering capabilities with creative visual design, motion graphics, video editing, and brand identity development.',
    ],
    passions: [
      'Artificial Intelligence & Machine Learning',
      'Full-Stack Web Development',
      'Graphic Design & Branding',
      'Video Editing & Motion Graphics',
      'Database Architecture & Security',
    ],
    contactEmail: 'agarwalpriyanshu@gmail.com',
    contactPhone: '+91 75684 41942',
    location: 'Jaipur, Rajasthan, India',
    github: 'https://github.com/agarwalpriyanshu886-ctrl',
    linkedin: 'https://www.linkedin.com/in/',
    instagram: 'https://www.instagram.com/priyanshu0.112',
  },

  education: [
    {
      id: 'nims-mtech',
      degree: 'M.Tech',
      field: 'Artificial Intelligence & Machine Learning',
      institution: 'NIMS University Jaipur',
      location: 'Jaipur, Rajasthan',
      duration: '1 Year (Postgraduate)',
      years: '2028 – 2029',
      badge: 'Postgraduate Research',
      description:
        'Specialized master degree research in advanced neural network architectures, deep learning models, natural language processing, and AI system design.',
      highlights: ['Deep Learning', 'Neural Architectures', 'NLP Research', 'AI System Design'],
    },
    {
      id: 'nims-btech',
      degree: 'B.Tech',
      field: 'Artificial Intelligence & Machine Learning',
      institution: 'NIMS University Jaipur',
      location: 'Jaipur, Rajasthan',
      duration: '4 Years (Undergraduate)',
      years: '2024 – 2028',
      badge: 'Undergraduate Engineering',
      description:
        'Core undergraduate engineering education focusing on computer science, AI algorithms, data structures, full-stack development, and software engineering.',
      highlights: ['Computer Science', 'AI & ML Algorithms', 'Full-Stack Web', 'Data Structures'],
    },
    {
      id: 'resonance-jaipur',
      degree: 'IIT-JEE Foundation & Competitive Coaching',
      field: 'Class 11th & 12th Science Stream',
      institution: 'Resonance Jaipur (Tonk Road, Mahaveer Nagar)',
      location: 'Jaipur, Rajasthan',
      duration: '2 Years (Class 11–12)',
      years: '2022 – 2024',
      badge: 'Competitive Foundation',
      description:
        'Intensive 2-year IIT-JEE foundation training in Physics, Chemistry, and Advanced Mathematics under top faculty guidance (founded by Mr. R.K. Verma, IIT Madras). Built analytical problem-solving skills, competitive discipline, and mathematical intuition.',
      highlights: ['Physics & Chemistry', 'Advanced Mathematics', 'Analytical Aptitude', 'JEE Preparation'],
    },
    {
      id: 'shree-vidhya-ashram',
      degree: 'Primary & Senior Secondary Schooling',
      field: 'Class 1st to 12th Standard',
      institution: 'Shree Vidhya Ashram International School',
      location: 'Chimanpura, Shahpura, Rajasthan 303103',
      duration: '12 Years (Schooling)',
      years: '2010 – 2024',
      badge: 'Foundational Schooling',
      description:
        'Complete foundational schooling from Class 1st to 12th. Built academic grounding in science, mathematics, computer fundamentals, and extracurricular leadership.',
      highlights: ['General Academics', 'Science Stream', 'Computer Basics', 'School Leadership'],
    },
  ],

  projects: [
    {
      id: 'agarwals-chopati',
      title: 'Agarwals Chopati Web Application',
      category: 'CODE × DESIGN HYBRID',
      shortDescription:
        'A modern restaurant website with menu management, gallery submissions, customer reviews, and full admin dashboard.',
      fullDescription:
        'Agarwals Chopati is a signature hybrid project combining full-stack React, Vite, Supabase, and RBAC authentication with custom brand identity, typography, and visual assets.',
      techStack: ['React', 'Vite', 'Supabase', 'JavaScript', 'Tailwind CSS', 'PostgreSQL'],
      liveDemoUrl: 'https://agarwalschopati.vercel.app',
      githubUrl: 'https://github.com/agarwalpriyanshu886-ctrl',
      developerHighlights: ['React', 'Supabase', 'Auth RBAC', 'PostgreSQL'],
      creativeHighlights: ['Brand Identity', 'UI Design', 'Visual Assets', 'Motion'],
    },
    {
      id: 'agarwals-chopati-app',
      title: 'Agarwals Chopati Android Mobile App',
      category: 'Mobile Application',
      shortDescription:
        'A customer-focused restaurant mobile application built with Jetpack Compose for fast browsing and food ordering.',
      fullDescription:
        'Native Android mobile application built with Kotlin, Jetpack Compose UI, and Firebase backend.',
      techStack: ['Kotlin', 'Jetpack Compose', 'Firebase', 'Android SDK'],
      developerHighlights: ['Kotlin', 'Jetpack Compose', 'Firebase Realtime DB'],
    },
  ],

  skills: {
    tech: [
      'Python',
      'Artificial Intelligence / Machine Learning',
      'Neural Networks & Deep Learning',
      'React & Vite',
      'JavaScript & TypeScript',
      'Supabase & PostgreSQL',
      'Node.js',
      'Kotlin & Jetpack Compose',
      'Tailwind CSS',
    ],
    creative: [
      'Graphic Design',
      'Adobe Photoshop',
      'Adobe Illustrator',
      'Adobe Premiere Pro',
      'Adobe After Effects',
      'DaVinci Resolve',
      'Motion Graphics & Video Editing',
      'Figma & UI/UX Design',
      'Brand Identity',
    ],
  },

  algorithmsAndCS: [
    {
      category: 'Artificial Intelligence & Machine Learning',
      topics: ['Neural Networks', 'Gradient Descent', 'Backpropagation', 'Convolutional Networks (CNN)', 'Transformers', 'Decision Trees', 'Random Forests', 'K-Means Clustering'],
      explanation: 'Priyanshu works with core AI/ML algorithms including supervised classification, unsupervised clustering, deep learning architectures, and neural network optimization.',
    },
    {
      category: 'Data Structures & Core CS',
      topics: ['Arrays', 'Linked Lists', 'Trees & Graphs', 'Hash Tables', 'Stacks & Queues', 'Sorting & Searching', 'Dynamic Programming', 'Greedy Algorithms'],
      explanation: 'Foundational computer science principles utilized for efficient software implementation, data manipulation, and computational complexity optimization.',
    },
    {
      category: 'Full-Stack & Web Architecture',
      topics: ['REST APIs', 'Realtime Subscriptions', 'Relational Database Design', 'State Management', 'Component Lifecycle', 'WebGL Rendering'],
      explanation: 'Modern web engineering standards driving fast, interactive user interfaces backed by scalable cloud services.',
    },
  ],

  faqs: [
    {
      question: 'Who is Priyanshu Agarwal?',
      answer:
        'Priyanshu Agarwal is an AI/ML Engineer, Full-Stack Developer, and Creative Visual Artist pursuing integrated B.Tech + M.Tech at NIMS University Jaipur.',
    },
    {
      question: 'What is Pittu?',
      answer:
        'Pittu is Priyanshu\'s official 3D AI Portfolio Agent digital host and guide.',
    },
    {
      question: 'What algorithms does Priyanshu study and apply?',
      answer:
        'Priyanshu applies machine learning algorithms (Neural Networks, CNNs, Transformers, Gradient Descent), fundamental data structures & algorithms (Graphs, Trees, Sorting, Dynamic Programming), and web architectures (React, Supabase, WebGL).',
    },
    {
      question: 'What is Agarwals Chopati?',
      answer:
        'Agarwals Chopati is Priyanshu\'s live full-stack restaurant application (Live demo: https://agarwalschopati.vercel.app).',
    },
    {
      question: 'Where did Priyanshu study?',
      answer:
        'Priyanshu completed schooling (1–12) at Shree Vidhya Ashram International School, JEE Foundation at Resonance Jaipur, and is pursuing B.Tech + M.Tech at NIMS University Jaipur.',
    },
  ],

  allowedTopics: [
    'Priyanshu\'s skills, tech stack, and CS algorithms',
    'Priyanshu\'s projects (Agarwals Chopati, AI models, Apps)',
    'Academic Journey & Education (Schooling, Resonance, NIMS)',
    'Graphic design & video editing capabilities',
    'How to contact or hire Priyanshu',
    'Public social links and public resume links',
  ],

  restrictedTopics: [
    'Passwords, API keys, and environment variables',
    'Supabase service role keys and database secrets',
    'Private personal data or unverified claims',
    'Off-topic non-portfolio queries',
  ],
}
