import { useCallback, useEffect, useState } from 'react'
import { useSocket } from '../providers/Socket'
import ReactPlayer from 'react-player'
import peer from '../service/peer'
import { Link } from 'react-router-dom'

export default function RoomPage() {
    const [remoteSocketId, setRemoteSocketId] = useState(null)
    const [myStream, setMyStream] = useState()
    const [remoteStream, setRemoteStream] = useState()
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
        const offer = await peer.getOffer()
        socket.emit('user:call', { to: remoteSocketId, offer })
    }, [remoteSocketId, socket])

    const handleInComingCall = useCallback(
        async ({ from, offer }) => {
            setRemoteSocketId(from)
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true,
                video: true,
            })
            setMyStream(stream)
            console.log(`incoming call`, from, offer)
            const ans = await peer.getAnswer(offer)
            socket.emit('call:accepted', { to: from, ans })
        },
        [socket]
    )

    const sendStreams = useCallback(() => {
        for (const track of myStream.getTracks()) {
            peer.peer.addTrack(track, myStream)
        }
    }, [myStream])

    const handleCallAccepted = useCallback(
        async ({ from, ans }) => {
            await peer.setLocalDescription(ans)
            console.log('Call Accepted')
            sendStreams()
        },
        [sendStreams]
    )

    const handleNegoNeeded = useCallback(async () => {
        const offer = await peer.getOffer()
        socket.emit('peer:nego:needed', { offer, to: remoteSocketId })
    }, [remoteSocketId, socket])

    const handleNegoNeedIncoming = useCallback(
        async ({ from, offer }) => {
            const ans = await peer.getAnswer(offer)
            socket.emit('peer:nego:done', { to: from, ans })
        },
        [socket]
    )

    const handleNegoNeedFinal = useCallback(async ({ ans }) => {
        await peer.setLocalDescription(ans)
    }, [])

    useEffect(() => {
        peer.peer.addEventListener('negotiationneeded', handleNegoNeeded)

        return () => {
            peer.peer.removeEventListener('negotiationneeded', handleNegoNeeded)
        }
    }, [handleNegoNeeded])

    useEffect(() => {
        peer.peer.addEventListener('track', async (ev) => {
            const remoteStream = ev.streams
            console.log('Got Tracks, remoteStream', remoteStream)
            setRemoteStream(remoteStream[0])
        })
    }, [])

    useEffect(() => {
        socket.on('user:joined', handleUserJoined)
        socket.on('incoming:call', handleInComingCall)
        socket.on('call:accepted', handleCallAccepted)
        socket.on('peer:nego:needed', handleNegoNeedIncoming)
        socket.on('peer:nego:final', handleNegoNeedFinal)

        return () => {
            socket.off('user:joined', handleUserJoined)
            socket.off('incoming:call', handleInComingCall)
            socket.off('call:accepted', handleCallAccepted)
            socket.off('peer:nego:needed', handleNegoNeedIncoming)
            socket.off('peer:nego:final', handleNegoNeedFinal)
        }
    }, [
        socket,
        handleUserJoined,
        handleInComingCall,
        handleCallAccepted,
        handleNegoNeedIncoming,
        handleNegoNeedFinal,
    ])

    return (
        <>
            {/* <h1 className='text-3xl font-bold underline'>Hello in room page</h1> */}
            <h4>{remoteSocketId ? 'Connected' : 'No one in the room'}</h4>
            {myStream && (
                <button
                    type='button'
                    // className='focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900'
                    className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800'
                    onClick={sendStreams}
                >
                    Send Stream
                </button>
            )}

            {remoteSocketId && (
                <button
                    type='button'
                    className='focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800'
                    onClick={handleCall}
                >
                    Call
                </button>
            )}

            <div className='flex justify-center items-center gap-6 p-4 mx-auto'>
                {myStream && (
                    <div className='flex flex-col items-start gap-y-4 bg-stone-100 rounded-md w-2/4 h-dvh'>
                        <h4>My Stream</h4>
                        <ReactPlayer
                            className='bg-white border-2 shadow-md'
                            playing
                            controls
                            height='80%'
                            width='100%'
                            muted
                            volume={1}
                            url={myStream}
                        />
                    </div>
                )}
                {remoteStream && (
                    <div className='flex flex-col items-start gap-y-4 bg-stone-100 rounded-md w-2/4 h-dvh'>
                        <h4>Remote Stream</h4>
                        <ReactPlayer
                            className='bg-white border-2 shadow-md rounded-lg'
                            playing
                            controls
                            height='80%'
                            width='100%'
                            muted
                            volume={1}
                            url={remoteStream}
                        />
                    </div>
                )}
            </div>
            <Link to={'/'}>Lobby</Link>
        </>
    )
}
