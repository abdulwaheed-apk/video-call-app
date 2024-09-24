import { Route, Routes } from 'react-router-dom'
import './App.css'
import { SocketProvider } from './providers/Socket'
import Lobby from './screens/Lobby'
import RoomPage from './screens/Room'

function App() {
    SocketProvider
    return (
        <main>
            <SocketProvider>
                <Routes>
                    <Route path='/' element={<Lobby />} />
                    <Route path='/room/:roomId' element={<RoomPage />} />
                </Routes>
            </SocketProvider>
        </main>
    )
}

export default App
