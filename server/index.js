import express from 'express'
import bodyParser from 'body-parser'
import { Server } from 'socket.io'

const io = new Server(8001, { cors: true })
const app = express()

app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.send('<h1>Hello world</h1>');
});

const emailToSocketIdMap = new Map()
const socketIdToEmailMap = new Map()

io.on('connection', (socket) => {
  console.log('New Connection', socket.id)
  socket.on('room:join', (data) => {
    // console.log('data bk', data)
    const { email, roomId } = data
    emailToSocketIdMap.set(email, socket.id)
    socketIdToEmailMap.set(socket.id, email)
    io.to(roomId).emit('user:joined', { email, id: socket.id })
    socket.join(roomId)
    io.to(socket.id).emit('room:join', data)
  })
})


app.listen(8000, () => { 'server running at http://localhost:8000' })