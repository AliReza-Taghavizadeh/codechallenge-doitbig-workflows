import { useBuilderStore } from './store/builderStore'
import TopBar from './components/TopBar'
import Canvas from './components/Canvas'
import Sidebar from './components/Sidebar'

export default function App() {
  const mode = useBuilderStore((s) => s.mode)
  const selectButton = useBuilderStore((s) => s.selectButton)

  const onCanvasButtonClick = () => {
    if (mode === 'design') selectButton()
  }

  return (
    <div className="h-full w-full flex flex-col bg-slate-100">
      <TopBar onTest={() => { /* wired in step 5 */ }} />
      <div className="flex-1 flex min-h-0">
        <Canvas onButtonClick={onCanvasButtonClick} />
        <Sidebar />
      </div>
    </div>
  )
}
