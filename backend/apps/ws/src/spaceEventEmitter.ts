import { EventEmitter } from "eventemitter3";
import { IUser } from "./user";
import { SpaceManager } from "./spaceManager";
type eventHandler<T> = (spaceManager: SpaceManager , data: T) => void
export class SpaceEventEmitter extends EventEmitter { 
    static instance : SpaceEventEmitter
    constructor() {super()}
    static getInstance() { 
        if(!this.instance) { 
            this.instance = new SpaceEventEmitter()
        }
        return this.instance
    }


    public dispatch<T>(eventName: string, data: T ) { 
        this.emit(eventName, data)
    }

    
    
}