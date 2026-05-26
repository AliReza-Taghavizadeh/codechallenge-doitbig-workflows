import { useBuilderStore } from '../store/builderStore'

export default function Canvas({ onButtonClick }) {
  const mode = useBuilderStore((s) => s.mode)
  const button = useBuilderStore((s) => s.button)
  const selectedId = useBuilderStore((s) => s.selectedId)
  const clearSelection = useBuilderStore((s) => s.clearSelection)

  const isDesign = mode === 'design'
  const selected = selectedId === button.id

  const canvasClass = isDesign
    ? 'flex-1 blueprint-bg relative overflow-auto'
    : 'flex-1 bg-slate-50 relative overflow-auto'

  const btnBase = 'px-6 py-3 rounded-xl font-medium text-sm transition select-none'
  const btnLook = isDesign
    ? 'bg-white text-slate-800 border-2 border-dashed border-white/70 shadow-soft hover:bg-white'
    : 'bg-indigo-500 text-white border border-indigo-500 shadow-soft hover:bg-indigo-600'
  const btnSelected = selected && isDesign ? ' ring-4 ring-indigo-300/70' : ''

  return (
    <div className={canvasClass} onClick={isDesign ? clearSelection : undefined}>
      {isDesign && (
        <div className="absolute top-4 left-5 text-xs uppercase tracking-widest text-white/60 font-medium">
          Design mode
        </div>
      )}
      <div className="h-full w-full grid place-items-center p-10">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onButtonClick()
          }}
          className={btnBase + ' ' + btnLook + btnSelected}
        >
          {button.label || 'Untitled button'}
        </button>
      </div>
    </div>
  )
}
