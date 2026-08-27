export interface ProjectMetadata {
  id: string
  slug: string
  title: string
  category: 'CODE' | 'DESIGN' | 'HYBRID' | 'MOBILE'
  shortDescription: string
  fullDescription: string
  problem: string
  solution: string
  techStack: string[]
  architecture: string
  features: string[]
  status: 'LIVE' | 'IN_DEVELOPMENT' | 'COMPLETED'
  demoUrl?: string
  githubUrl?: string
  developerHighlights?: string[]
  creativeHighlights?: string[]
}

export interface EducationMetadata {
  id: string
  degree: string
  field: string
  institution: string
  location: string
  duration: string
  years: string
  badge: string
  sgpa?: string
  description: string
  highlights: string[]
}

export interface ExperienceMetadata {
  id: string
  role: string
  company: string
  duration: string
  startDate: string
  endDate: string
  type: string
  points: string[]
}

export interface SkillCategoryItem {
  id: string
  label: string
  icon: string
  accent: string
  skills: Array<{
    name: string
    level: number
    icon: string
  }>
}

export interface HeroCMSData {
  greetingPill: string
  firstName: string
  lastName: string
  roles: string[]
  typingSpeed?: number
  deletingSpeed?: number
  pauseDuration?: number
  shortDescription: string
  primaryCtaLabel: string
  primaryCtaHref: string
  secondaryCtaLabel: string
  secondaryCtaHref: string
  codeSnippet: string
}

export interface StatMetadata {
  id: string
  label: string
  value: number
  suffix: string
}

export interface CertificationMetadata {
  id: string
  title: string
  organization: string
  date: string
  url?: string
  media?: string
  description?: string
}

export interface SectionConfig {
  id: string
  name: string
  enabled: boolean
  paddingTopRem: number
  paddingBottomRem: number
}

export interface LayoutConfigData {
  preset: 'compact' | 'balanced' | 'spacious'
  sections: SectionConfig[]
}

export interface ResumeMetadata {
  id: string
  title: string
  subtitle: string
  badge: string
  badgeType: 'available' | 'progress'
  url: string
  updatedAt?: string
  fileSize?: string
  isPrimary?: boolean
}

export interface PublicKnowledgeBase {
  profile: {
    name: string
    title: string
    roles: string[]
    bio: string
    passions: string[]
    location: string
    contactEmail: string
    contactPhone: string
    github: string
    linkedin: string
    instagram: string
    resumeUrl?: string
  }
  hero: HeroCMSData
  stats: StatMetadata[]
  certifications: CertificationMetadata[]
  resumes?: ResumeMetadata[]
  layoutConfig: LayoutConfigData
  publicContactConfig: {
    showEmail: boolean
    showPhone: boolean
    showLinkedIn: boolean
    showGithub: boolean
    showContactForm: boolean
  }
  education: EducationMetadata[]
  experience: ExperienceMetadata[]
  projects: ProjectMetadata[]
  skills: {
    tech: string[]
    creative: string[]
    coursework: string[]
  }
  skillCategories: SkillCategoryItem[]
  websiteStack: {
    framework: string
    bundler: string
    styling: string
    threeD: string
    database: string
    hosting: string
  }
  activities: Array<{
    title: string
    organization: string
    description: string
  }>
  faqs: Array<{
    question: string
    answer: string
    category: 'GENERAL' | 'PROJECTS' | 'EDUCATION' | 'SKILLS' | 'EXPERIENCE'
  }>
  allowedTopics: string[]
  restrictedTopics: string[]
}

export const PUBLIC_KNOWLEDGE: PublicKnowledgeBase = {
  profile: {
    name: 'Priyanshu Agarwal',
    title: 'AI/ML Engineer & Full-Stack Developer',
    roles: ['AI/ML Student', 'Programmer', 'Full-Stack Developer', 'Graphic Designer', 'Video Editor', 'Visual Artist'],
    bio: 'Priyanshu Agarwal is a passionate engineering student pursuing an integrated B.Tech + M.Tech in Artificial Intelligence & Machine Learning at NIMS University Jaipur (SGPA: 8.86). He combines deep software and AI engineering capabilities with creative visual design, motion graphics, video editing, and brand identity development.',
    passions: [
      'Artificial Intelligence & Machine Learning',
      'Full-Stack Web Engineering',
      'Database Systems & Relational Schema Design',
      'Graphic Design & Brand Identity',
      'Video Editing & Motion Graphics',
      'Autonomous AI Systems & Automation',
    ],
    location: 'Jaipur, Rajasthan, India',
    contactEmail: 'agarwalpriyanshu@gmail.com',
    contactPhone: '+91 75684 41942',
    github: 'https://github.com/agarwalpriyanshu886-ctrl',
    linkedin: 'https://www.linkedin.com/in/',
    instagram: 'https://www.instagram.com/priyanshu0.112',
  },

  hero: {
    greetingPill: '• Hi, I\'m Priyanshu Agarwal — Engineering student @ NIMS University Jaipur',
    firstName: 'Priyanshu',
    lastName: 'Agarwal',
    roles: ['AI/ML Student', 'Programmer', 'Full-Stack Developer', 'Graphic Designer', 'Video Editor', 'Visual Artist'],
    typingSpeed: 70,
    deletingSpeed: 40,
    pauseDuration: 1600,
    shortDescription: 'I build intelligent, scalable and visually impressive digital experiences using AI, modern web technologies and software engineering.',
    primaryCtaLabel: 'View My Projects',
    primaryCtaHref: '#projects',
    secondaryCtaLabel: 'Contact Me',
    secondaryCtaHref: '#contact',
    codeSnippet: 'def build(idea):\n    return ai + web',
  },

  stats: [
    { id: 'stat-1', label: 'Projects Completed', value: 15, suffix: '+' },
    { id: 'stat-2', label: 'Technologies Learned', value: 20, suffix: '+' },
    { id: 'stat-3', label: 'Certifications', value: 8, suffix: '+' },
    { id: 'stat-4', label: 'Years of Learning', value: 3, suffix: '+' },
  ],

  certifications: [
    {
      id: 'cert-1',
      title: 'Python for Data Science & AI',
      organization: 'IBM / Coursera',
      date: '2024',
      url: 'https://coursera.org',
      description: 'Covered Python fundamentals, Pandas, NumPy, and data manipulation libraries for machine learning workflows.',
    },
    {
      id: 'cert-2',
      title: 'Full-Stack Web Development Mastery',
      organization: 'NIMS University Technical Society',
      date: '2024',
      url: 'https://nimsuniversity.org',
      description: 'Advanced web engineering with React, Node.js, REST APIs, and relational database schema architectures.',
    },
  ],

  resumes: [
    {
      id: 'creative-technologist',
      title: '1. CREATIVE TECHNOLOGIST RESUME',
      subtitle: 'AI/ML Engineering, Full-Stack Web/App Development & Visual Design',
      badge: 'Available (PDF)',
      badgeType: 'available',
      url: '/resumes/Priyanshu_Agarwal_Creative_Technologist_Resume.pdf',
      updatedAt: '2026-08-27',
      fileSize: '1.2 MB',
      isPrimary: true,
    },
    {
      id: 'achievements',
      title: '2. ACHIEVEMENTS & AWARDS RESUME',
      subtitle: 'Competitions, Hackathons, Technical Medals & Key Accomplishments',
      badge: 'Available (PDF)',
      badgeType: 'available',
      url: '/resumes/Priyanshu_Agarwal_Creative_Technologist_Resume.pdf',
      updatedAt: '2026-08-27',
      fileSize: '950 KB',
      isPrimary: false,
    },
    {
      id: 'other-purposes',
      title: '3. OTHER PURPOSES / GENERAL RESUME',
      subtitle: 'General Corporate, Academic & Specialized Project Profiles',
      badge: 'Available (PDF)',
      badgeType: 'available',
      url: '/resumes/Priyanshu_Agarwal_Creative_Technologist_Resume.pdf',
      updatedAt: '2026-08-27',
      fileSize: '880 KB',
      isPrimary: false,
    },
  ],

  layoutConfig: {
    preset: 'compact',
    sections: [
      { id: 'hero', name: 'Hero Section', enabled: true, paddingTopRem: 2, paddingBottomRem: 2 },
      { id: 'about', name: 'About & Stats Section', enabled: true, paddingTopRem: 2.5, paddingBottomRem: 2.5 },
      { id: 'skills', name: 'Technical Skills Section', enabled: true, paddingTopRem: 2.5, paddingBottomRem: 2.5 },
      { id: 'projects', name: 'Projects Catalog Section', enabled: true, paddingTopRem: 2.5, paddingBottomRem: 2.5 },
      { id: 'experience', name: 'Work Experience Section', enabled: true, paddingTopRem: 2.5, paddingBottomRem: 2.5 },
      { id: 'education', name: 'Academic Journey Section', enabled: true, paddingTopRem: 2.5, paddingBottomRem: 2.5 },
      { id: 'certifications', name: 'Certifications Section', enabled: true, paddingTopRem: 2.5, paddingBottomRem: 2.5 },
      { id: 'github', name: 'GitHub Activity Section', enabled: true, paddingTopRem: 2.5, paddingBottomRem: 2.5 },
      { id: 'contact', name: 'Contact Form Section', enabled: true, paddingTopRem: 2.5, paddingBottomRem: 2.5 },
    ],
  },

  publicContactConfig: {
    showEmail: true,
    showPhone: false,
    showLinkedIn: true,
    showGithub: true,
    showContactForm: true,
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
      description: 'Specialized master degree research in advanced neural network architectures, deep learning models, natural language processing, and autonomous AI system design.',
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
      sgpa: '8.86 SGPA (Semester 1)',
      description: 'Core undergraduate engineering education focusing on computer science, AI algorithms, data structures, full-stack development, DBMS, C, Java, Python, and software engineering.',
      highlights: ['8.86 SGPA', 'C/Java/Python', 'DBMS & SQL', 'Data Structures & Algorithms', 'AI/ML Core'],
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
      description: 'Intensive 2-year IIT-JEE foundation training in Physics, Chemistry, and Advanced Mathematics under top faculty guidance (founded by Mr. R.K. Verma, IIT Madras). Built sharp analytical problem-solving skills, competitive discipline, and mathematical intuition.',
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
      description: 'Complete foundational schooling from Class 1st to 12th. Built a strong academic grounding in science, mathematics, computer fundamentals, and extracurricular leadership.',
      highlights: ['General Academics', 'Science Stream', 'Computer Basics', 'School Leadership'],
    },
  ],

  experience: [
    {
      id: 'graphic-design-intern',
      role: 'Graphic Design Intern',
      company: 'Jaldiride Connect Pvt Ltd',
      companyUrl: 'https://jaldiride.com',
      logo: 'https://jaldiride.com/favicon.ico',
      duration: '3 Months',
      startDate: 'Nov 2025',
      endDate: 'Jan 2026',
      type: 'Internship',
      points: [
        'Designed marketing creatives, digital banners, and social media graphics that strengthened brand consistency across channels.',
        'Collaborated with design teams to translate campaign briefs into high-impact, polished visual assets.',
        'Applied professional workflows in Adobe Photoshop, Illustrator, and Canva under production deadlines.',
      ],
    },
  ],

  projects: [
    {
      id: 'agarwals-chopati',
      slug: 'agarwals-chopati',
      title: 'Agarwals Chopati Web Application',
      category: 'HYBRID',
      shortDescription: 'A modern vegetarian restaurant digital ecosystem in Shahpura with menu management, customer gallery, and admin CMS dashboard.',
      fullDescription: 'Agarwals Chopati (Tagline: "Swad Shahpura Ka") is a signature hybrid project combining full-stack React, Vite, Supabase, and RBAC authentication with custom luxury dark brand identity, typography, and visual assets.',
      problem: 'Traditional restaurant platforms lack real-time digital ordering, custom branding, and customer gallery approval workflows.',
      solution: 'Built a responsive React + Supabase web application with custom design system, dynamic menu CMS, and real-time database updates.',
      techStack: ['React', 'Vite', 'Supabase', 'JavaScript', 'Tailwind CSS', 'PostgreSQL'],
      architecture: 'Single Page Application (SPA) frontend with Supabase backend-as-a-service providing PostgreSQL data layer, Auth RBAC, and storage.',
      features: ['Dynamic Menu Management (300+ Dishes)', 'Customer Gallery Uploads & Review System', 'Admin Review & Approval Workflow', 'Responsive Dark Glassmorphic Design'],
      status: 'LIVE',
      demoUrl: 'https://agarwalschopati.vercel.app',
      githubUrl: 'https://github.com/agarwalpriyanshu886-ctrl',
      developerHighlights: ['React', 'Supabase', 'Auth RBAC', 'PostgreSQL'],
      creativeHighlights: ['Brand Identity', 'UI Design', 'Visual Assets', 'Motion Graphics'],
    },
    {
      id: 'agarwals-chopati-app',
      slug: 'agarwals-chopati-app',
      title: 'Agarwals Chopati Android Mobile App',
      category: 'MOBILE',
      shortDescription: 'A customer-focused restaurant mobile application built with Jetpack Compose for fast browsing and ordering.',
      fullDescription: 'Native Android mobile application built with Kotlin, Jetpack Compose UI, and Firebase backend.',
      problem: 'Mobile users require a lightweight, touch-optimized Android experience for viewing food items.',
      solution: 'Developed a native Android app in Kotlin using modern Jetpack Compose declarative UI architecture.',
      techStack: ['Kotlin', 'Jetpack Compose', 'Firebase', 'Android SDK'],
      architecture: 'Native Android app following MVVM pattern with Jetpack Compose UI layer.',
      features: ['Kotlin Declarative UI', 'Realtime Menu Feed', 'Mobile Touch Optimization'],
      status: 'COMPLETED',
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
      'Three.js & React Three Fiber',
      'Git & GitHub',
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
      'Brand Identity & Canva',
    ],
    coursework: [
      'C Programming & Tokens/Structures/Unions',
      'Java & Object-Oriented Programming',
      'Python Data Science',
      'DBMS (Relational Schemas, Triggers, Views, SQL)',
      'Data Structures & Algorithms',
      'PPS & BEE (Basic Electrical Engineering)',
    ],
  },

  skillCategories: [
    {
      id: 'programming',
      label: 'Programming',
      icon: 'code',
      accent: '#6366f1',
      skills: [
        { name: 'C', level: 75, icon: 'SiC' },
        { name: 'C++', level: 75, icon: 'SiCplusplus' },
        { name: 'Java', level: 70, icon: 'SiOpenjdk' },
        { name: 'Python', level: 85, icon: 'SiPython' },
        { name: 'JavaScript', level: 80, icon: 'SiJavascript' },
      ],
    },
    {
      id: 'web',
      label: 'Web Development',
      icon: 'globe',
      accent: '#22d3ee',
      skills: [
        { name: 'HTML', level: 90, icon: 'SiHtml5' },
        { name: 'CSS', level: 85, icon: 'SiCss' },
        { name: 'React', level: 78, icon: 'SiReact' },
        { name: 'Vite', level: 75, icon: 'SiVite' },
        { name: 'Node.js', level: 70, icon: 'SiNodedotjs' },
      ],
    },
    {
      id: 'database',
      label: 'Database',
      icon: 'database',
      accent: '#34d399',
      skills: [
        { name: 'SQL', level: 80, icon: 'TbSql' },
        { name: 'MySQL', level: 78, icon: 'SiMysql' },
        { name: 'MongoDB', level: 70, icon: 'SiMongodb' },
        { name: 'Supabase', level: 72, icon: 'SiSupabase' },
      ],
    },
    {
      id: 'ai',
      label: 'AI / ML',
      icon: 'brain',
      accent: '#a78bfa',
      skills: [
        { name: 'Python', level: 85, icon: 'SiPython' },
        { name: 'Machine Learning', level: 75, icon: 'SiScikitlearn' },
        { name: 'Neural Networks', level: 70, icon: 'LuBrain' },
        { name: 'Data Analysis', level: 76, icon: 'SiPandas' },
      ],
    },
    {
      id: 'tools',
      label: 'Tools',
      icon: 'wrench',
      accent: '#fbbf24',
      skills: [
        { name: 'Git', level: 80, icon: 'SiGit' },
        { name: 'GitHub', level: 82, icon: 'SiGithub' },
        { name: 'VS Code', level: 88, icon: 'VscVscode' },
        { name: 'Android Studio', level: 68, icon: 'SiAndroidstudio' },
      ],
    },
  ],

  websiteStack: {
    framework: 'React (Vite)',
    bundler: 'Vite / Rolldown',
    styling: 'Tailwind CSS & Vanilla CSS',
    threeD: 'Three.js & React Three Fiber (@react-three/fiber, @react-three/drei)',
    database: 'Supabase (PostgreSQL)',
    hosting: 'Local Dev Server (Port 5174) & Vercel deployment',
  },

  activities: [
    {
      title: 'NSS Committee Leadership',
      organization: 'National Service Scheme (NSS)',
      description: 'Led community activities including Smart Village Development and social service drives.',
    },
  ],

  faqs: [
    {
      category: 'GENERAL',
      question: 'Who is Priyanshu Agarwal?',
      answer: 'Priyanshu Agarwal is an AI/ML Engineer, Full-Stack Developer, and Creative Visual Artist pursuing an integrated B.Tech + M.Tech in AI/ML at NIMS University Jaipur (SGPA: 8.86).',
    },
    {
      category: 'EXPERIENCE',
      question: 'Where has Priyanshu interned?',
      answer: 'Priyanshu served as a Graphic Design Intern at JALDIRIDE CONNECT PVT LTD (Nov 2025 – Jan 2026), creating digital marketing assets and brand graphics.',
    },
    {
      category: 'GENERAL',
      question: 'What is Pittu AI?',
      answer: 'Pittu AI is the official 3D digital host and portfolio guide for Priyanshu Agarwal\'s portfolio website.',
    },
    {
      category: 'PROJECTS',
      question: 'What is Agarwals Chopati?',
      answer: 'Agarwals Chopati is a live full-stack restaurant web application and Android app built by Priyanshu for a vegetarian restaurant in Shahpura (Live demo: https://agarwalschopati.vercel.app).',
    },
    {
      category: 'EDUCATION',
      question: 'Where did Priyanshu study?',
      answer: 'Priyanshu completed schooling (1–12) at Shree Vidhya Ashram International School, JEE Foundation coaching at Resonance Jaipur, and is pursuing B.Tech + M.Tech in AI/ML at NIMS University Jaipur (8.86 SGPA in Sem 1).',
    },
  ],

  allowedTopics: [
    'Priyanshu\'s skills, technologies, and creative capabilities',
    'Priyanshu\'s projects (Agarwals Chopati, Android Apps, AI models)',
    'Academic Journey & Education (Schooling, Resonance, NIMS B.Tech + M.Tech, 8.86 SGPA)',
    'Graphic Design Internship @ JALDIRIDE CONNECT PVT LTD',
    'Website architecture and technology stack',
    'Public social links and public resume download',
    'Public contact form and email',
  ],

  restrictedTopics: [
    'Passwords, API keys, and environment variables',
    'Supabase service role keys and database secrets',
    'Private phone numbers and personal home address',
    'Private conversations, personal relationships, or family data',
    'Salary estimates, private financial data, or unverified claims',
  ],
}
