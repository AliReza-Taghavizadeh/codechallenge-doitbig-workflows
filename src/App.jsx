import { useBuilderStore, selectWorkflow } from './store/builderStore'
import { useLogStore } from './store/logStore'
import TopBar from './components/TopBar'
import Canvas from './components/Canvas'
import Sidebar from './components/Sidebar'
import RunLog from './components/RunLog'

export default function App() {
  const mode = useBuilderStore((s) => s.mode)
  const selectButton = useBuilderStore((s) => s.selectButton)
  const workflow = useBuilderStore(selectWorkflow)
  const startRun = useLogStore((s) => s.start)

  const runWorkflow = () => startRun(workflow)

  const onCanvasButtonClick = () => {
    if (mode === 'design') selectButton()
    else runWorkflow()
  }

  return (
    <div className="h-full w-full flex flex-col bg-slate-100">
      <TopBar onTest={runWorkflow} />
      <div className="flex-1 flex min-h-0">
        <Canvas onButtonClick={onCanvasButtonClick} />
        <Sidebar />
      </div>
      <RunLog />
    </div>
  )
}
