import { useState } from 'react'
import './App.css'

export default function App() {
  const [selected, setSelected] = useState(null)

  const button = { id: 'button1', name: 'button1', label: 'Click me' }

  return (
    <div className="layout">
      <main className="main">
        <button
          className={`canvas-button${selected === button.id ? ' is-selected' : ''}`}
          onClick={() => setSelected(button.id)}
        >
          {button.label}
        </button>
      </main>

      {selected === button.id && (
        <aside className="inspector">
          <header className="inspector-header">
            <span className="inspector-title">{button.name}</span>
            <button
              className="inspector-close"
              onClick={() => setSelected(null)}
              aria-label="Close inspector"
            >
              ×
            </button>
          </header>
          <div className="inspector-body">
            {/* developer logic goes here */}
          </div>
        </aside>
      )}
    </div>
  )
}
