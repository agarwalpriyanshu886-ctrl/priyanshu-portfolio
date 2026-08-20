import Reveal from './Reveal'

export default function Timeline({ items, renderItem }) {
  return (
    <div className="relative pl-6 sm:pl-8 border-l border-white/10 space-y-10">
      {items.map((item, index) => (
        <Reveal key={item.id || index} delay={index * 0.1} className="relative">
          <span className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-ink-950 border-2 border-cyan-400 shadow-[0_0_12px_2px_rgb(34_211_238/0.5)]" />
          {renderItem(item)}
        </Reveal>
      ))}
    </div>
  )
}
