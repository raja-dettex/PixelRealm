export type UserEvent = { 
    type: string,
    payload: Payload
}

export type JoinEventPayload = { 
    spaceId: string,
    token: string
}

export type MovementEventPayload = { 
    x: number,
    y: number
}
export type Payload = any
export type Message = any