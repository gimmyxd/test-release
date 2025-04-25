import { motion } from 'motion/react'
import { FpsView } from 'react-fps'

import './App.css'
import Virtualized from './components/Virtualized'

function App() {
  return (
    <>
      <div
        style={{
          position: 'fixed',
          right: 0,
          top: 0,
        }}
      >
        <div className="App">
          <FpsView />
          <Virtualized isVirtualizationEnabled={true} rowHeight={60}>
            {new Array(16000)
              .fill({})
              .map((_, index) => ({ id: index }))
              .map((it) => (
                <motion.li
                  key={it.id}
                  animate={{
                    scale: [0.89, 1],
                  }}
                  className="row"
                >
                  {it.id}
                </motion.li>
              ))}
          </Virtualized>
        </div>
      </div>
    </>
  )
}

export default App
