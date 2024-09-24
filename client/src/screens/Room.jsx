import { useCallback, useEffect, useState } from 'react'
import { useSocket } from '../providers/Socket'
import ReactPlayer from 'react-player'

export default function RoomPage() {
    const [remoteSocketId, setRemoteSocketId] = useState(null)
    const [myStream, setMyStream] = useState(null)
    const socket = useSocket()

    const handleUserJoined = useCallback((data) => {
        console.log(`user ${data.email} joined. socket id :${data.id}`)
        setRemoteSocketId(data.id)
    }, [])

    const handleCall = useCallback(async () => {
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true,
        })
        setMyStream(stream)
    }, [])

    useEffect(() => {
        socket.on('user:joined', handleUserJoined)
        return () => {
            socket.off('user:joined', handleUserJoined)
        }
    }, [socket, handleUserJoined])

    return (
        <>
            <h1 className='text-3xl font-bold underline'>Hello in room page</h1>
            <h4>{remoteSocketId ? 'Connected' : 'No one in the room'}</h4>
            {remoteSocketId && <button onClick={handleCall}>Call</button>}
            {myStream && (
                <ReactPlayer
                    muted
                    playing
                    width={'300px'}
                    height={'200px'}
                    url={myStream}
                />
            )}
        </>
    )
}
