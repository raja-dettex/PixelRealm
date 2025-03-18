import { WebSocketServer} from 'ws'
import { SpaceManager } from './spaceManager'
import { User } from './user'

const server = new WebSocketServer({port: 4000})
const spaceManager = SpaceManager.getInstance()

server.on('connection' , ws => { 
    console.log("client connected")
    const user = new User(spaceManager, ws)
    ws.on('message', (message)=> {
        const data = JSON.parse(message.toString()) 
        console.log(data)
        user.handleEvent(data)
    })
    ws.on('error', (error)=> console.log(error))
    ws.on('close' , ()=> { 
        console.log('client gave up')
        spaceManager.removeUser(ws)
    })
})


console.log("ws listening ")