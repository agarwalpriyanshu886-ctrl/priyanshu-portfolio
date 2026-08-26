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
  SiPostgresql,
  SiRedis,
  SiGraphql,
  SiKubernetes,
  SiVercel,
  SiNetlify,
  SiPostman,
  SiFastapi,
  SiFlask,
  SiExpress,
  SiNumpy,
  SiOpencv,
  SiKeras,
  SiUnity,
  SiUnrealengine,
  SiBlender,
  SiRust,
  SiGo,
  SiSwift,
  SiSpringboot,
  SiBootstrap,
  SiSass,
  SiRedux,
  SiPrisma,
  SiNpm,
  SiBun,
  SiDeno,
} from 'react-icons/si'
import { VscVscode } from 'react-icons/vsc'
import { TbSql } from 'react-icons/tb'
import { LuBrain, LuVideo, LuLayers, LuCpu, LuTerminal, LuSmartphone, LuCloud, LuShield } from 'react-icons/lu'
import {
  FaCode,
  FaGlobe,
  FaDatabase,
  FaWrench,
  FaPalette,
  FaFilm,
  FaVideo,
  FaPhotoVideo,
  FaEdit,
  FaCut,
  FaServer,
  FaGamepad,
  FaRobot,
  FaChartLine,
  FaPaintBrush,
  FaCloud,
  FaLock,
  FaTools,
} from 'react-icons/fa'

export const AVAILABLE_SKILL_ICONS = [
  // Programming & Core Languages
  { id: 'SiPython', name: 'Python', icon: SiPython },
  { id: 'SiReact', name: 'React', icon: SiReact },
  { id: 'SiJavascript', name: 'JavaScript', icon: SiJavascript },
  { id: 'SiTypescript', name: 'TypeScript', icon: SiTypescript },
  { id: 'SiHtml5', name: 'HTML5', icon: SiHtml5 },
  { id: 'SiCss', name: 'CSS3', icon: SiCss },
  { id: 'SiC', name: 'C Language', icon: SiC },
  { id: 'SiCplusplus', name: 'C++', icon: SiCplusplus },
  { id: 'SiOpenjdk', name: 'Java (JDK)', icon: SiOpenjdk },
  { id: 'SiRust', name: 'Rust', icon: SiRust },
  { id: 'SiGo', name: 'Go / Golang', icon: SiGo },
  { id: 'SiSwift', name: 'Swift', icon: SiSwift },
  { id: 'SiKotlin', name: 'Kotlin', icon: SiKotlin },

  // Web & Backend Frameworks
  { id: 'SiVite', name: 'Vite', icon: SiVite },
  { id: 'SiNodedotjs', name: 'Node.js', icon: SiNodedotjs },
  { id: 'SiNextdotjs', name: 'Next.js', icon: SiNextdotjs },
  { id: 'SiExpress', name: 'Express.js', icon: SiExpress },
  { id: 'SiFastapi', name: 'FastAPI', icon: SiFastapi },
  { id: 'SiDjango', name: 'Django', icon: SiDjango },
  { id: 'SiFlask', name: 'Flask', icon: SiFlask },
  { id: 'SiSpringboot', name: 'Spring Boot', icon: SiSpringboot },
  { id: 'SiTailwindcss', name: 'Tailwind CSS', icon: SiTailwindcss },
  { id: 'SiBootstrap', name: 'Bootstrap', icon: SiBootstrap },
  { id: 'SiSass', name: 'Sass / SCSS', icon: SiSass },
  { id: 'SiRedux', name: 'Redux', icon: SiRedux },
  { id: 'SiPrisma', name: 'Prisma ORM', icon: SiPrisma },

  // AI, Data Science & Machine Learning
  { id: 'LuBrain', name: 'Artificial Intelligence & Neural Nets', icon: LuBrain },
  { id: 'SiScikitlearn', name: 'Scikit-Learn', icon: SiScikitlearn },
  { id: 'SiPandas', name: 'Pandas Data Analysis', icon: SiPandas },
  { id: 'SiNumpy', name: 'NumPy', icon: SiNumpy },
  { id: 'SiTensorflow', name: 'TensorFlow', icon: SiTensorflow },
  { id: 'SiPytorch', name: 'PyTorch Deep Learning', icon: SiPytorch },
  { id: 'SiKeras', name: 'Keras', icon: SiKeras },
  { id: 'SiOpencv', name: 'OpenCV Computer Vision', icon: SiOpencv },
  { id: 'SiJupyter', name: 'Jupyter Notebooks', icon: SiJupyter },

  // Databases & Backend Systems
  { id: 'TbSql', name: 'SQL Database', icon: TbSql },
  { id: 'SiMysql', name: 'MySQL', icon: SiMysql },
  { id: 'SiPostgresql', name: 'PostgreSQL', icon: SiPostgresql },
  { id: 'SiMongodb', name: 'MongoDB', icon: SiMongodb },
  { id: 'SiSupabase', name: 'Supabase Cloud DB', icon: SiSupabase },
  { id: 'SiFirebase', name: 'Google Firebase', icon: SiFirebase },
  { id: 'SiRedis', name: 'Redis Cache', icon: SiRedis },
  { id: 'SiGraphql', name: 'GraphQL API', icon: SiGraphql },

  // Mobile App & Game Development
  { id: 'SiAndroidstudio', name: 'Android Studio', icon: SiAndroidstudio },
  { id: 'SiFlutter', name: 'Flutter Cross-Platform', icon: SiFlutter },
  { id: 'SiUnity', name: 'Unity 3D Engine', icon: SiUnity },
  { id: 'SiUnrealengine', name: 'Unreal Engine', icon: SiUnrealengine },

  // Cloud, DevOps & Linux Infrastructure
  { id: 'SiDocker', name: 'Docker Containers', icon: SiDocker },
  { id: 'SiKubernetes', name: 'Kubernetes', icon: SiKubernetes },
  { id: 'SiLinux', name: 'Linux Terminal OS', icon: SiLinux },
  { id: 'FaCloud', name: 'AWS & Cloud Systems', icon: FaCloud },
  { id: 'SiVercel', name: 'Vercel Platform', icon: SiVercel },
  { id: 'SiNetlify', name: 'Netlify', icon: SiNetlify },
  { id: 'SiGit', name: 'Git Version Control', icon: SiGit },
  { id: 'SiGithub', name: 'GitHub', icon: SiGithub },

  // Dev Tools & Package Runtimes
  { id: 'VscVscode', name: 'VS Code Editor', icon: VscVscode },
  { id: 'SiPostman', name: 'Postman API Tester', icon: SiPostman },
  { id: 'SiNpm', name: 'NPM Package Manager', icon: SiNpm },
  { id: 'SiBun', name: 'Bun High-Speed Runtime', icon: SiBun },
  { id: 'SiDeno', name: 'Deno Runtime', icon: SiDeno },

  // Creative, Design & Media Suite
  { id: 'SiFigma', name: 'Figma UI/UX Design', icon: SiFigma },
  { id: 'FaPalette', name: 'Photoshop / Graphic Design', icon: FaPalette },
  { id: 'FaPhotoVideo', name: 'Illustrator / Vector Graphics', icon: FaPhotoVideo },
  { id: 'FaFilm', name: 'Premiere Pro / Video Editing', icon: FaFilm },
  { id: 'FaVideo', name: 'After Effects / Motion Graphics', icon: FaVideo },
  { id: 'SiDavinciresolve', name: 'DaVinci Resolve Color Grading', icon: SiDavinciresolve },
  { id: 'SiBlender', name: 'Blender 3D Suite', icon: SiBlender },
  { id: 'FaPaintBrush', name: 'Canva Pro & Visual Branding', icon: FaPaintBrush },
  { id: 'FaCut', name: 'CapCut / Mobile Video Editor', icon: FaCut },
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
  { id: 'server', name: 'Backend & Server', icon: FaServer },
  { id: 'gamepad', name: 'Game Development', icon: FaGamepad },
  { id: 'robotics', name: 'Robotics & Automation', icon: FaRobot },
  { id: 'analytics', name: 'Data Analytics & Stats', icon: FaChartLine },
  { id: 'paintbrush', name: 'Visual Arts & Vectors', icon: FaPaintBrush },
  { id: 'shield', name: 'Cyber Security', icon: LuShield },
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
