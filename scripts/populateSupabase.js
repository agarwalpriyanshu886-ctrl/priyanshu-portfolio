import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://bcgbzpnhsubddtpzwutl.supabase.co'
const SUPABASE_KEY = 'sb_publishable_OWvWgcO7JoIWCnuuadoevQ_kjyj9ztI'

const client = createClient(SUPABASE_URL, SUPABASE_KEY)

async function populateAllSupabaseTables() {
  console.log('🚀 Populating all Supabase database tables with complete portfolio data...')
  const now = new Date().toISOString()

  // 1. Master Table (portfolio_cms)
  const fullData = {
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
      greetingPill: "• Hi, I'm Priyanshu Agarwal — Engineering student @ NIMS University Jaipur",
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
    experience: [
      {
        id: 'graphic-design-intern',
        role: 'Graphic Design Intern',
        company: 'JALDIRIDE CONNECT PVT LTD',
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
        description: 'Intensive 2-year IIT-JEE foundation training in Physics, Chemistry, and Advanced Mathematics under top faculty guidance. Built sharp analytical problem-solving skills.',
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
    projects: [
      {
        id: 'agarwals-chopati',
        slug: 'agarwals-chopati',
        title: 'Agarwals Chopati Web Application',
        category: 'HYBRID',
        shortDescription: 'A modern vegetarian restaurant digital ecosystem in Shahpura with menu management, customer gallery, and admin CMS dashboard.',
        fullDescription: 'Agarwals Chopati (Tagline: "Swad Shahpura Ka") is a signature hybrid project combining full-stack React, Vite, Supabase, and RBAC authentication with custom luxury dark brand identity.',
        problem: 'Traditional restaurant platforms lack real-time digital ordering, custom branding, and customer gallery approval workflows.',
        solution: 'Built a responsive React + Supabase web application with custom design system, dynamic menu CMS, and real-time database updates.',
        techStack: ['React', 'Vite', 'Supabase', 'JavaScript', 'Tailwind CSS', 'PostgreSQL'],
        architecture: 'Single Page Application (SPA) frontend with Supabase backend-as-a-service.',
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
        problem: 'Mobile users require a lightweight, touch-optimized Android experience.',
        solution: 'Developed a native Android app in Kotlin using modern Jetpack Compose declarative UI architecture.',
        techStack: ['Kotlin', 'Jetpack Compose', 'Firebase', 'Android SDK'],
        architecture: 'Native Android app following MVVM pattern with Jetpack Compose UI layer.',
        features: ['Kotlin Declarative UI', 'Realtime Menu Feed', 'Mobile Touch Optimization'],
        status: 'COMPLETED',
        demoUrl: 'https://agarwalschopati.vercel.app',
        githubUrl: 'https://github.com/agarwalpriyanshu886-ctrl',
        developerHighlights: ['Kotlin', 'Jetpack Compose', 'Firebase Realtime DB'],
      },
    ],
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
  }

  // 1. Master Table Upsert
  const masterRes = await client.from('portfolio_cms').upsert({ id: 'active_cms', data: fullData, updated_at: now })
  console.log('1. Table portfolio_cms:', masterRes.error ? masterRes.error.message : '✅ Populated')

  // 2. Profiles Table Upsert
  const profRes = await client.from('profiles').upsert({
    id: 'primary_profile',
    name: fullData.profile.name,
    title: fullData.profile.title,
    bio: fullData.profile.bio,
    location: fullData.profile.location,
    contact_email: fullData.profile.contactEmail,
    contact_phone: fullData.profile.contactPhone,
    github: fullData.profile.github,
    linkedin: fullData.profile.linkedin,
    instagram: fullData.profile.instagram,
    roles: fullData.profile.roles,
    passions: fullData.profile.passions,
    updated_at: now,
  })
  console.log('2. Table profiles:', profRes.error ? profRes.error.message : '✅ Populated')

  // 3. Hero Section Table Upsert
  const heroRes = await client.from('hero_section').upsert({
    id: 'primary_hero',
    greeting_pill: fullData.hero.greetingPill,
    first_name: fullData.hero.firstName,
    last_name: fullData.hero.lastName,
    short_description: fullData.hero.shortDescription,
    primary_cta_label: fullData.hero.primaryCtaLabel,
    primary_cta_href: fullData.hero.primaryCtaHref,
    secondary_cta_label: fullData.hero.secondaryCtaLabel,
    secondary_cta_href: fullData.hero.secondaryCtaHref,
    roles: fullData.hero.roles,
    code_snippet: fullData.hero.codeSnippet,
    updated_at: now,
  })
  console.log('3. Table hero_section:', heroRes.error ? heroRes.error.message : '✅ Populated')

  // 4. Projects Catalog Table Upsert
  const projRows = fullData.projects.map((p) => ({
    id: p.id,
    title: p.title,
    category: p.category,
    status: p.status,
    short_description: p.shortDescription,
    full_description: p.fullDescription,
    tech_stack: p.techStack,
    demo_url: p.demoUrl,
    github_url: p.githubUrl,
    image_url: p.image || p.imageUrl || '',
    updated_at: now,
  }))
  const projRes = await client.from('projects').upsert(projRows)
  console.log('4. Table projects:', projRes.error ? projRes.error.message : '✅ Populated')

  // 5. Work Experience Table Upsert
  const expRows = fullData.experience.map((e) => ({
    id: e.id,
    role: e.role,
    company: e.company,
    company_url: e.companyUrl,
    logo_url: e.logo,
    duration: e.duration,
    start_date: e.startDate,
    end_date: e.endDate,
    type: e.type,
    points: e.points,
    updated_at: now,
  }))
  const expRes = await client.from('work_experience').upsert(expRows)
  console.log('5. Table work_experience:', expRes.error ? expRes.error.message : '✅ Populated')

  // 6. Academic Journey Table Upsert
  const eduRows = fullData.education.map((ed) => ({
    id: ed.id,
    degree: ed.degree,
    field: ed.field,
    institution: ed.institution,
    location: ed.location,
    duration: ed.duration,
    years: ed.years,
    badge: ed.badge,
    sgpa: ed.sgpa,
    description: ed.description,
    highlights: ed.highlights,
    updated_at: now,
  }))
  const eduRes = await client.from('academic_journey').upsert(eduRows)
  console.log('6. Table academic_journey:', eduRes.error ? eduRes.error.message : '✅ Populated')

  // 7. Certifications Table Upsert
  const certRows = fullData.certifications.map((c) => ({
    id: c.id,
    title: c.title,
    organization: c.organization,
    date: c.date,
    url: c.url,
    description: c.description,
    updated_at: now,
  }))
  const certRes = await client.from('certifications').upsert(certRows)
  console.log('7. Table certifications:', certRes.error ? certRes.error.message : '✅ Populated')

  // 8. Skill Categories Table Upsert
  const catRows = fullData.skillCategories.map((sc) => ({
    id: sc.id,
    label: sc.label,
    icon: sc.icon,
    accent: sc.accent,
    skills: sc.skills,
    updated_at: now,
  }))
  const catRes = await client.from('skill_categories').upsert(catRows)
  console.log('8. Table skill_categories:', catRes.error ? catRes.error.message : '✅ Populated')

  console.log('\n🎉 ALL 8 SUPABASE TABLES SUCCESSFULLY POPULATED WITH YOUR PORTFOLIO DATA!')
}

populateAllSupabaseTables()
