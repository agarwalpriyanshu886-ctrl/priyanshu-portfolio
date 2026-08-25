import {
  SiC,
  SiCplusplus,
  SiOpenjdk,
  SiPython,
  SiJavascript,
  SiHtml5,
  SiCss,
  SiReact,
  SiVite,
  SiNodedotjs,
  SiMysql,
  SiMongodb,
  SiSupabase,
  SiScikitlearn,
  SiPandas,
  SiGit,
  SiGithub,
  SiAndroidstudio,
  SiJupyter,
  SiDavinciresolve,
  SiTensorflow,
  SiPytorch,
  SiKotlin,
  SiFirebase,
  SiDjango,
  SiDocker,
  SiLinux,
  SiFigma,
  SiTailwindcss,
  SiTypescript,
  SiNextdotjs,
  SiFlutter,
} from 'react-icons/si'
import { VscVscode } from 'react-icons/vsc'
import { TbSql } from 'react-icons/tb'
import { LuBrain, LuVideo, LuLayers, LuCpu, LuTerminal, LuSmartphone, LuCloud, LuShield } from 'react-icons/lu'
import { FaCode, FaGlobe, FaDatabase, FaWrench, FaPalette, FaFilm, FaVideo, FaPhotoVideo, FaEdit, FaCut } from 'react-icons/fa'

export const AVAILABLE_SKILL_ICONS = [
  { id: 'SiPython', name: 'Python', icon: SiPython },
  { id: 'SiReact', name: 'React', icon: SiReact },
  { id: 'SiJavascript', name: 'JavaScript', icon: SiJavascript },
  { id: 'SiTypescript', name: 'TypeScript', icon: SiTypescript },
  { id: 'SiHtml5', name: 'HTML5', icon: SiHtml5 },
  { id: 'SiCss', name: 'CSS3', icon: SiCss },
  { id: 'SiC', name: 'C', icon: SiC },
  { id: 'SiCplusplus', name: 'C++', icon: SiCplusplus },
  { id: 'SiOpenjdk', name: 'Java', icon: SiOpenjdk },
  { id: 'SiVite', name: 'Vite', icon: SiVite },
  { id: 'SiNodedotjs', name: 'Node.js', icon: SiNodedotjs },
  { id: 'SiNextdotjs', name: 'Next.js', icon: SiNextdotjs },
  { id: 'SiTailwindcss', name: 'Tailwind CSS', icon: SiTailwindcss },
  { id: 'TbSql', name: 'SQL', icon: TbSql },
  { id: 'SiMysql', name: 'MySQL', icon: SiMysql },
  { id: 'SiMongodb', name: 'MongoDB', icon: SiMongodb },
  { id: 'SiSupabase', name: 'Supabase', icon: SiSupabase },
  { id: 'SiScikitlearn', name: 'Scikit-Learn', icon: SiScikitlearn },
  { id: 'LuBrain', name: 'Neural Networks', icon: LuBrain },
  { id: 'SiPandas', name: 'Pandas', icon: SiPandas },
  { id: 'SiTensorflow', name: 'TensorFlow', icon: SiTensorflow },
  { id: 'SiPytorch', name: 'PyTorch', icon: SiPytorch },
  { id: 'SiGit', name: 'Git', icon: SiGit },
  { id: 'SiGithub', name: 'GitHub', icon: SiGithub },
  { id: 'VscVscode', name: 'VS Code', icon: VscVscode },
  { id: 'SiAndroidstudio', name: 'Android Studio', icon: SiAndroidstudio },
  { id: 'SiKotlin', name: 'Kotlin', icon: SiKotlin },
  { id: 'SiFlutter', name: 'Flutter', icon: SiFlutter },
  { id: 'SiFirebase', name: 'Firebase', icon: SiFirebase },
  { id: 'SiDocker', name: 'Docker', icon: SiDocker },
  { id: 'SiLinux', name: 'Linux', icon: SiLinux },
  { id: 'SiDavinciresolve', name: 'DaVinci Resolve', icon: SiDavinciresolve },
  { id: 'SiFigma', name: 'Figma', icon: SiFigma },
  { id: 'FaPalette', name: 'Photoshop / Graphic Design', icon: FaPalette },
  { id: 'FaPhotoVideo', name: 'Illustrator / Vector Graphics', icon: FaPhotoVideo },
  { id: 'FaFilm', name: 'Premiere Pro / Video Editing', icon: FaFilm },
  { id: 'FaVideo', name: 'After Effects / Motion Graphics', icon: FaVideo },
  { id: 'FaCut', name: 'CapCut / VN Editing', icon: FaCut },
]

export const AVAILABLE_CATEGORY_ICONS = [
  { id: 'code', name: 'Programming / Code', icon: FaCode },
  { id: 'globe', name: 'Web / Web Dev', icon: FaGlobe },
  { id: 'database', name: 'Database / SQL', icon: FaDatabase },
  { id: 'brain', name: 'AI / Machine Learning', icon: LuBrain },
  { id: 'wrench', name: 'Tools & Utilities', icon: FaWrench },
  { id: 'palette', name: 'Graphic & Creative Design', icon: FaPalette },
  { id: 'video', name: 'Video Editing & Motion', icon: LuVideo },
  { id: 'mobile', name: 'Mobile Engineering', icon: LuSmartphone },
  { id: 'terminal', name: 'DevOps & Terminal', icon: LuTerminal },
  { id: 'cpu', name: 'Hardware & Embedded', icon: LuCpu },
  { id: 'layers', name: 'System Architecture', icon: LuLayers },
  { id: 'cloud', name: 'Cloud & Infrastructure', icon: LuCloud },
]

const iconsMap = {}
AVAILABLE_SKILL_ICONS.forEach((item) => {
  iconsMap[item.id] = item.icon
})

const categoryIconsMap = {}
AVAILABLE_CATEGORY_ICONS.forEach((item) => {
  categoryIconsMap[item.id] = item.icon
})

export function SkillIcon({ name, className }) {
  if (name && (name.startsWith('http://') || name.startsWith('https://') || name.startsWith('data:'))) {
    return <img src={name} alt="skill logo" className={`w-4 h-4 object-contain inline-block ${className || ''}`} />
  }
  const IconComponent = iconsMap[name] || FaCode
  return <IconComponent className={className} />
}

export function CategoryIcon({ name, className }) {
  const IconComponent = categoryIconsMap[name] || FaCode
  return <IconComponent className={className} />
}
