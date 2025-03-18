import {WebSocket } from 'ws'

const client1 = new WebSocket('ws://localhost:4000')
const client2 = new WebSocket('ws://localhost:4000')
const client3 = new WebSocket('ws://localhost:4000')

jest.setTimeout(7000)
describe('user events', ()=> { 
    beforeAll(async () => {
        const _ = await new Promise<void>((resolve) => {
            let connectedCount = 0
            const checkConnected = () => { 
                connectedCount++;
                if(connectedCount === 3) { 
                    console.log("resolving")
                    resolve()
                }
                
            } 
            client1.onopen = (e) =>  { 
                console.log("client 1 connected " + client1)
                checkConnected()
            }
            client2.onopen = (e) =>  { 
                console.log("client 2 connected " + client2)
                checkConnected()
            }
            client3.onopen = (e) => { 
                console.log("client 3 connected " + client3)
                checkConnected()
            }
            client1.onerror = (e) => console.log(e.error)
            client2.onerror = (e) => console.log(e.error)
        }) 
        console.log("outside before all promise")
        
    })
    it('user will be able to send join events and events will be brodcasted', async () => { 
        const joinEvent = {
            type: "join",
            payload: {
                spaceId: "123",
                token: "token_received_during_login"
            }
        }
        console.log(joinEvent)
        const messages: any = []
        await new Promise<void>((resolve, reject) => { 
            setTimeout(()=> reject(), 6000)
            
            // client2.onmessage = (event) => { 
                
            //     console.log("here ")
            //     console.log(event.data)
            //     messages.push(event.data.toString())
            //     console.log("messages length " + messages.length)
            //     if(messages.length === 2) resolve()
            // }
            client1.onmessage = (event) => { 
                
                console.log("here ")
                console.log(event.data)
                messages.push(event.data.toString())
                console.log("messages length " + messages.length)
                if(messages.length === 6) resolve()
            }

            client3.onmessage = (event) => { 
                
                console.log("here ")
                console.log(event.data)
                messages.push(event.data.toString())
                console.log("messages length " + messages.length)
                if(messages.length === 6) resolve()
            }
            console.log(client1)
            console.log(client2)
            setTimeout(() => {
                console.log("sending messages to client1");
                client1.send(JSON.stringify(joinEvent)); // Ensure sending happens after listening starts
                client2.send(JSON.stringify(joinEvent));
                client3.send(JSON.stringify(joinEvent))
                console.log("sent messages to client1");
            }, 500);
        })
        expect(messages.length).not.toBe(0)
        expect(messages[0]).toBeDefined()
        console.log(messages[0])
    })
    afterAll(()=> {
        client1.close()
        client2.close()
    })
})