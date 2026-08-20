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
} from 'react-icons/si'
import { VscVscode } from 'react-icons/vsc'
import { TbSql } from 'react-icons/tb'
import { LuBrain } from 'react-icons/lu'
import { FaCode, FaGlobe, FaDatabase, FaWrench, FaPalette } from 'react-icons/fa'

const icons = {
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
  TbSql,
  SiMysql,
  SiMongodb,
  SiSupabase,
  SiScikitlearn,
  LuBrain,
  SiPandas,
  SiGit,
  SiGithub,
  VscVscode,
  SiAndroidstudio,
  SiJupyter,
  FaPalette,
  SiDavinciresolve,
  SiTensorflow,
  SiPytorch,
  SiKotlin,
  SiFirebase,
  SiDjango,
  SiDocker,
  SiLinux,
}

const categoryIcons = {
  code: FaCode,
  globe: FaGlobe,
  database: FaDatabase,
  brain: LuBrain,
  wrench: FaWrench,
}

export function SkillIcon({ name, className }) {
  const Icon = icons[name] || SiC
  return <Icon className={className} />
}

export function CategoryIcon({ name, className }) {
  const Icon = categoryIcons[name] || FaCode
  return <Icon className={className} />
}
