import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSocket } from '../providers/Socket'

export default function Lobby() {
    const [email, setEmail] = useState('')
    const [roomId, setRoomId] = useState('')

    const socket = useSocket()
    const navigate = useNavigate()

    const handleSubmitForm = useCallback(
        (e) => {
            e.preventDefault()
            socket.emit('room:join', { roomId, email })
        },
        [roomId, email, socket]
    )

    const handleJoinRoom = useCallback(
        (data) => {
            const { roomId, email } = data
            navigate(`/room/${roomId}`)
        },
        [navigate]
    )

    useEffect(() => {
        socket.on('room:join', handleJoinRoom)
        return () => {
            socket.off('room:join', handleJoinRoom)
        }
    }, [socket, handleJoinRoom])

    return (
        <div className='w-[480px] max-h-max bg-gray-100 shadow-md rounded-lg m-auto mt-20 pt-4 pb-2'>
            <form onSubmit={handleSubmitForm}>
                <div className='mb-6 w-11/12 mx-auto text-left'>
                    <label
                        htmlFor='email'
                        className='block mb-2 text-sm font-medium'
                    >
                        Email address
                    </label>
                    <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type='email'
                        id='email'
                        className='bg-gray-50 border border-gray-300 text-black text-sm rounded-lg block w-full p-2.5'
                        placeholder='Enter email'
                        // autoComplete='off'
                        required
                    />
                </div>
                <div className='mb-6 w-11/12 mx-auto text-left'>
                    <label
                        htmlFor='room-id'
                        className='block mb-2 text-sm font-medium text-black'
                    >
                        Room Id
                    </label>
                    <input
                        value={roomId}
                        onChange={(e) => setRoomId(e.target.value)}
                        type='text'
                        id='room-id'
                        className='bg-gray-50 border border-gray-300 text-black text-sm rounded-lg block w-full p-2.5 '
                        placeholder='Enter room id'
                        // autoComplete='off'
                        required
                    />
                </div>
                <div className='mb-6 w-11/12 mx-auto'>
                    <button
                        type='submit'
                        className='w-full bg-red-500 hover:bg-red-600 text-white outline-none font-bold py-2 px-4 rounded'
                    >
                        Join Meeting Room
                    </button>
                </div>
            </form>
        </div>
    )
}
