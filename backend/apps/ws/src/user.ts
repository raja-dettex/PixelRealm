import axios  from "axios"
import { SpaceManager } from "./spaceManager"
import { Message, UserEvent } from "./types"
import { JoinEventPayload, MovementEventPayload } from "./types"
import { WebSocket } from "ws"
import jwt, {JwtPayload} from "jsonwebtoken"
import { SpaceEventEmitter } from "./spaceEventEmitter"

const HttpClient = { 
    get: async ({...args}) => { 
        const { url, headers } = args
        try { 
            const res = await axios.get(url, {headers: headers})
            return res
        } catch(error: any) { 
            return error.response
        }
    }
}

export interface IUser { 
    id: string,
    ws: WebSocket
    messages : UserEvent[]
    send(message: Message): any
    toString() : string 
}

function getRandom(length: number): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}
export class User implements IUser{
    public id: string
    public ws: WebSocket
    private userId?: string
    private spaceId?: string
    private x?: number
    private y?:number   
    public messages: UserEvent[]
    constructor(private spaceManager: SpaceManager,  ws: WebSocket) { 
        this.id = getRandom(10)
        this.ws = ws
        this.initHandler()
        this.messages = []
    }

    public initHandler() { 
        this.ws.on('message', async (e)=> { 
            const data = JSON.parse(e.toString())
            const _ = await this.handleEvent(data)
        })
    }
    
    public async handleEvent(event: UserEvent) {
        for(const user of this.spaceManager.getUsers()) { 
            console.log(user?user.toString() : "user is undef")
        }
        switch(event.type) { 
            case "join" : {
                const {spaceId, token} = event.payload
                // check if the space exists
                const res = await HttpClient.get({url: `http://localhost:3000/api/v1/space/${spaceId}`,
                    headers : { Authorization: `Bearer ${token}`}
                })
                if(res.status !== 200) { 
                    this.ws.close()
                    return
                }
                // get the userId from the token
                try { 
                    console.log(token)
                    this.userId = (jwt.verify(token, 'secret') as JwtPayload).id
                    if(!this.userId) { 
                        this.ws.close()
                        return
                    }
                    this.x = Math.floor(Math.random() * 20)
                    this.y = Math.floor(Math.random() * 20)
                    this.spaceId = spaceId        
                    this.spaceManager.addUser(spaceId, this)
                    this.spaceManager.broadcast({ 
                        type: 'user-join',
                        payload: { 
                            userId: this.userId,
                            x: this.x,
                            y: this.y
                        }
                    }, this, this.spaceId!)
                    this.spaceManager.getUsers()
                    const spaceJoinedEvent = {
                        type: "space-joined",
                        payload: { 
                            spawn: { 
                                x: this.x,
                                y: this.y
                            },
                            users: this.spaceManager.getUserIds(spaceId)
                        }
                    }
                    this.send(spaceJoinedEvent)
                    this.spaceManager.broadcast(spaceJoinedEvent, this, this.spaceId!)
                    const spaceEventEmitter = SpaceEventEmitter.getInstance()
                    spaceEventEmitter.emit('user-join', {id: this.id, spaceId: this.spaceId})
                    this.messages.push(spaceJoinedEvent)
                    break
                } catch(error) { 
                    console.log(error)
                    break
                }
            }
            case "move" : { 
                const {x, y} = event.payload
                const xDisplacement = Math.abs(x - this.x!)
                const yDisplacement = Math.abs(y- this.y!)
                if((xDisplacement === 1 && yDisplacement ===0) || (xDisplacement === 0 && yDisplacement === 1)) { 
                    this.x = x
                    this.y = y
                    const moveEvent = {
                        type: 'move',
                        payload: { 
                            userId: this.id,
                            x: this.x,
                            y: this.y
                        }
                    }
                    this.spaceManager.broadcast(moveEvent, this, this.spaceId!)
                    console.log("pushing")
                    this.messages.push(moveEvent)
                    break
                }
                this.send({
                    type: 'movement-rejected',
                    payload: { 
                        x: this.x,
                        y: this.y
                    }
                })
                
                break;
            }
        }
    }

    public handleUserLeft() { 
        this.spaceManager.removeUser(this, this.spaceId!)
    }

    public send(message: UserEvent) { 
        this.ws.send(JSON.stringify(message))
    }


    public toString(): string { 
        return "User[id = " + this.id + ", userId = " + this.userId + " ]"
    }

}