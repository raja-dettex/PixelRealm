import  { IUser } from "./user";
import { Message} from './types'
import { WebSocket } from "ws";

export class SpaceManager { 
    private spaceMap : Map<string,  IUser[]> = new Map()
    static instance : SpaceManager;
    constructor() { this.spaceMap = new Map()}
    static getInstance() { 
        if(!this.instance) { 
            this.instance = new SpaceManager()
        }
        return this.instance
    }

    public addUser(spaceId: string, user: IUser)  { 
        console.log("adding user")
        this.spaceMap.set(spaceId, [...(this.spaceMap.get(spaceId) ?? []), user])
        console.log("added user")
    }

    public broadcast(message: Message, user: IUser, spaceId: string) { 
        console.log("broadcasting")
        if(!this.spaceMap.has(spaceId)) { 
            return
        }
        console.log("here")
        this.spaceMap.get(spaceId)?.forEach(u => { 
            if(u.id !== user.id) { 
                console.log("sending brodcast")
                u.send(message)
            }
        })
        console.log("broadcasted")
    }

    public getUserIds(spaceId: string): {id: string}[] { 
        return this.spaceMap.get(spaceId)?.map((user) => ({id: user.id})) ?? []
    }

    public getUsers() : (IUser | undefined)[] { 
        console.log(this.spaceMap)
        console.log("keys...")
        console.log(Object.keys(this.spaceMap))
        const users =  Object.keys(this.spaceMap).flatMap(k => { 
            return this.spaceMap.get(k)
        }) 
        return users
    }


    public removeUser(ws: WebSocket) { 
        this.spaceMap.forEach((users, key )=> { 
            users.filter(user => user.ws !== ws)
        })
    }
}