import { useCallback, useEffect, useState } from 'react'
import { useSocket } from '../providers/Socket'
import ReactPlayer from 'react-player'
import peer from '../service/peer'

export default function RoomPage() {
    const [remoteSocketId, setRemoteSocketId] = useState(null)
    const [myStream, setMyStream] = useState(null)
    const socket = useSocket()

    const handleUserJoined = useCallback((data) => {
        console.log(`user ${data.email} joined. socket id :${data.id}`)
        setRemoteSocketId(data.id)
    }, [])

    const handleInComingCall = useCallback(({ from, offer }) => {
        console.log(`incoming call ${from} , ${offer}`)
    }, [])

    const handleCall = useCallback(async () => {
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true,
        })
        const offer = await peer.getOffer()
        socket.emit('user:call', { to: remoteSocketId, offer })
        setMyStream(stream)
    }, [remoteSocketId, socket])

    useEffect(() => {
        socket.on('user:joined', handleUserJoined)
        socket.on('incoming:call', handleInComingCall)

        return () => {
            socket.off('user:joined', handleUserJoined)
            socket.off('incoming:call', handleInComingCall)
        }
    }, [socket, handleUserJoined, handleInComingCall])

    return (
        <>
            <h1 className='text-3xl font-bold underline'>Hello in room page</h1>
            <h4>{remoteSocketId ? 'Connected' : 'No one in the room'}</h4>
            {remoteSocketId && <button onClick={handleCall}>Call</button>}
            {myStream && (
                <>
                    <h4>My Stream</h4>
                    <ReactPlayer
                        muted
                        playing
                        width={'300px'}
                        height={'200px'}
                        url={myStream}
                    />
                </>
            )}
        </>
    )
}
