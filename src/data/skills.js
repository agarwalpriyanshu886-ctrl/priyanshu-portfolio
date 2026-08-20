// Skill categories. level is a percentage 0-100 reflecting honest experience.
export const skillCategories = [
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
      { name: 'Jupyter Notebook', level: 78, icon: 'SiJupyter' },
      { name: 'Canva', level: 84, icon: 'FaPalette' },
      { name: 'DaVinci Resolve', level: 65, icon: 'SiDavinciresolve' },
    ],
  },
]

export const skills = skillCategories.flatMap((c) => c.skills)
