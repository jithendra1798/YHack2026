import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import SetupScreen from './components/SetupScreen'
import SessionScreen from './components/SessionScreen'
import RoomScreen from './components/RoomScreen'
import { useRoom } from './hooks/useRoom'

export default function App() {
  const [screen, setScreen] = useState('setup')
  const [context, setContext] = useState(null)
  const [mode, setMode] = useState(null)
  const room = useRoom()

  const handleStartLive = (ctx) => {
    setContext(ctx)
    setMode('live')
    setScreen('session')
  }

  const handleStartDemo = (ctx) => {
    setContext(ctx)
    setMode('demo')
    setScreen('session')
  }

  const handleStartVersus = () => {
    setScreen('room')
  }

  const handleRoomReady = (ctx) => {
    setContext(ctx)
    setMode('versus')
    setScreen('session')
  }

  const handleBack = () => {
    if (screen === 'room') {
      room.leaveRoom()
    }
    setScreen('setup')
    setContext(null)
    setMode(null)
  }

  return (
    <AnimatePresence mode="wait">
      {screen === 'setup' && (
        <motion.div
          key="setup"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <SetupScreen
            onStartLive={handleStartLive}
            onStartDemo={handleStartDemo}
            onStartVersus={handleStartVersus}
          />
        </motion.div>
      )}
      {screen === 'room' && (
        <motion.div
          key="room"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <RoomScreen room={room} onReady={handleRoomReady} onBack={handleBack} />
        </motion.div>
      )}
      {screen === 'session' && (
        <motion.div
          key="session"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <SessionScreen context={context} mode={mode} room={room} onBack={handleBack} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
