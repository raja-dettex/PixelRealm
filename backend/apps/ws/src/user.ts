import axios  from "axios"
import { SpaceManager } from "./spaceManager"
import { Message, UserEvent } from "./types"
import { JoinEventPayload, MovementEventPayload } from "./types"
import { WebSocket } from "ws"
import jwt, {JwtPayload} from "jsonwebtoken"

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
    constructor(private spaceManager: SpaceManager,  ws: WebSocket) { 
        this.id = getRandom(10)
        this.ws = ws
    }


    
    public async handleEvent(event: UserEvent) {
        console.log("handling....")
        console.log("users length " + this.spaceManager.getUsers().length)
        for(const user of this.spaceManager.getUsers()) { 
            console.log(user?user.toString() : "user is undef")
        }
        console.log("handling event") 
        switch(event.type) { 
            case "join" : {
                const {spaceId, token} = event.payload
                // check if the space exists
                const res = await HttpClient.get({url: `http://localhost:3000/api/v1/space/${spaceId}`,
                    headers : { Authorization: `Bearer ${token}`}
                })
                if(!res.data.space && spaceId !== res.data.space.spaceId) { 
                    this.ws.close()
                    return
                }
                this.spaceId = res.data.spaceId
                // get the userId from the token
                this.userId = (jwt.verify(token, "") as JwtPayload).id
                this.x = Math.floor(Math.random() * 20)
                this.y = Math.floor(Math.random() * 20)
                                  
                this.spaceManager.addUser(spaceId, this)
                this.spaceManager.broadcast({ 
                    type: 'user-join',
                    payload: { 
                        userId: this.userId,
                        x: this.x,
                        y: this.y
                    }
                }, this, spaceId)
                this.spaceManager.getUsers()
                this.send({
                    type: "space-joined",
                    payload: { 
                        spawn: { 
                            x: this.x,
                            y: this.y
                        },
                        users: this.spaceManager.getUserIds(spaceId)
                    }
                })
                break
            }
            case "move" : { 
                const {x, y} = event.payload
                const xDisplacement = Math.abs(x - this.x!)
                const yDisplacement = Math.abs(y- this.y!)
                if((xDisplacement === 1 && yDisplacement ===0) || (xDisplacement === 0 && yDisplacement === 1)) { 
                    this.x = x
                    this.y = y
                    this.spaceManager.broadcast({
                        type: 'move',
                        payload: { 
                            userId: this.userId!,
                            x: this.x,
                            y: this.y
                        }
                    }, this, this.spaceId!)
                }
                break;
            }
        }
    }

    public send(message: Message) { 
        this.ws.send(JSON.stringify(message))
    }


    public toString(): string { 
        return "User[id = " + this.id + ", userId = " + this.userId + " ]"
    }

}