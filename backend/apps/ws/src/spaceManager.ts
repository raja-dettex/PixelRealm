import  { IUser } from "./user";
import { Message, UserEvent} from './types'
import { WebSocket } from "ws";
import { SpaceEventEmitter } from "./spaceEventEmitter";

export class SpaceManager { 
    private spaceMap : Map<string,  IUser[]> = new Map()
    static instance : SpaceManager;
    
    constructor() { 
        this.spaceMap = new Map()
        this.userJoinBroadcasts()
    }
    static getInstance() { 
        if(!this.instance) { 
            this.instance = new SpaceManager()
        }
        return this.instance
    }

    public handleOldMessagesDispatch(data: {id: string, spaceId: string}) { 
        const { id, spaceId } = data
        
        
        const users = this.spaceMap.get(spaceId)
        if(users) { 
            const messages = users.filter(user => user.id !== id).flatMap(user => user.messages)
            for(const message of messages) { 
                console.log(message)
                users.filter(user => user.id != id).forEach(user => user.send(message))
            }
        }
    }

    public userJoinBroadcasts() { 
        const spaceEmitter = SpaceEventEmitter.getInstance()
        spaceEmitter.on('user-join', data => { 
            this.handleOldMessagesDispatch(data)
        })
    }

    public addUser(spaceId: string, user: IUser)  { 
        this.spaceMap.set(spaceId, [...(this.spaceMap.get(spaceId) ?? []), user])
    }

    

    public broadcast(message: Message, user: IUser, spaceId: string) { 

        if(!this.spaceMap.has(spaceId)) { 
            return
        }
        var count = 0

        this.spaceMap.get(spaceId)?.forEach(u => { 
            if(u.id !== user.id) { 
                
                u.send(message)
                count++;
            }
        })
        
        
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


    public removeUser(user: IUser, spaceId: string) { 
        console.log("Removin users")
        if(!this.spaceMap.has(spaceId)) return
        this.spaceMap.set(spaceId, this.spaceMap.get(spaceId)?.filter(u => u !== user) ?? [])
        console.log("user removed")
    }
}