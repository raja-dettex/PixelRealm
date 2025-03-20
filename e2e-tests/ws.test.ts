import {WebSocket } from 'ws'
import { HttpClient, URL} from './index.test'



jest.setTimeout(9000)
describe('user events', ()=> { 
    let userToken = ""
    let spaceId = ""
    let userId = ""
    const client1 = new WebSocket('ws://localhost:4000')
    const client2 = new WebSocket('ws://localhost:4000')
    const client3 = new WebSocket('ws://localhost:4000')
    beforeAll(async () => {
       
    
        const _ = await new Promise<void>((resolve, reject) => {
            console.log("here")
            let connectedCount = 0
            const checkConnected = () => { 
                connectedCount++;
                console.log(connectedCount)
                if(connectedCount === 3) { 
                    console.log("resolving")
                    resolve()
                }
                
            } 
            console.log(client1)
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
            client1.onerror = (e) => reject(new Error("Client 1 connection error: " + e.message));
            client2.onerror = (e) => reject(new Error("Client 2 connection error: " + e.message));
            client3.onerror = (e) => reject(new Error("Client 3 connection error: " + e.message));

        }) 
        console.log("outside before all promise")
         const username = "raja" + Math.random();
        const password = "pass" + Math.random();
        const userResponse = await HttpClient.post({url: `${URL}/api/v1/users/signup`,  
            username: username + "_user",
            password,
            type: 'user'
        })

        userId = userResponse?.data.id
        if(userResponse) { 
            expect(userResponse.status).toBe(201)
        }
        const userSignInResponse = await HttpClient.post({url: `${URL}/api/v1/users/signin`,  
            username: username + "_user", 
            password,
        })

        if(userSignInResponse) userToken = userSignInResponse.data.token
        const createdSpaceResponse = await HttpClient.post({
            url: `${URL}/api/v1/space`,
            name: "test space for ws",
            dimensions: "100x200",
            headers: { 
                Authorization: `Bearer ${userToken}`
            }
        })
        console.log("space created")
        if(createdSpaceResponse) { 
       
            expect(createdSpaceResponse.status).toBe(201)
           
            expect(createdSpaceResponse.data.spaceId).toBeDefined()
            spaceId = createdSpaceResponse.data.spaceId
            console.log(spaceId)
        }
        
    })
    it('user will be able to send join events and events will be brodcasted', async () => { 
        const joinEvent = {
            type: "join",
            payload: {
                spaceId: spaceId,
                token: userToken
            }
        }
        const moveEvent = { 
            type: "move",
            payload: { 
                x: 20,
                y: 30,
                userId: userId
            }
        }
        console.log(joinEvent)
        const messages: any = []
        try { 
            const _ = await new Promise<void>((resolve, reject) => { 
                setTimeout(()=> reject(new Error("timeout")), 8000)
                
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
                    if(messages.length === 9) resolve()
                }

                client3.onmessage = (event) => { 
                    
                    console.log("here ")
                    console.log(event.data)
                    messages.push(event.data.toString())
                    console.log("messages length " + messages.length)
                    if(messages.length === 9) resolve()
                }
                console.log(client1)
                console.log(client2)
                setTimeout(() => {
                    console.log("sending messages to client1");
                    client1.send(JSON.stringify(joinEvent)); // Ensure sending happens after listening starts
                    client2.send(JSON.stringify(joinEvent));
                    client3.send(JSON.stringify(joinEvent))
                    client2.send(JSON.stringify(moveEvent))
                    console.log("sent messages to client1");
                }, 500);
            })
        } catch(error) { 
            console.log(error)
        }
        expect(messages.length).not.toBe(0)
        expect(messages[0]).toBeDefined()
        for(const message of messages) { 
            console.log(message)
        }
    })
    afterAll(()=> {
        client1.close()
        client2.close()
    })
})