 import axios, { Axios, AxiosError } from "axios"

export const URL = "http://localhost:3000"

export const HttpClient = { 
    get : async ({...args}) => { 
        const {url, headers} = args
        
        try { 
            const res = await axios.get(url, {headers: headers})
            return res
        }catch(error) { 
            if(error instanceof AxiosError) {
                return error.response
            }
        }
    },
    post : async ({...args}) => { 
        const {url, headers} = args
        const keys = Object.keys(args).filter(key => key !== 'headers' && key !== 'url')
        const data: {[key: string]: any} = {}
        for(const key of keys) { 
            const value = args[key]
            data[key] = value
        }
        
        try { 
            const res = await axios.post(url, data, {headers: headers})
            return res
        }catch(error) { 
            
            if(error instanceof AxiosError) {
                
                return error.response
            }
        }
    },
    put : async ({...args}) => { 
        const {url, headers} = args
        const keys = Object.keys(args).filter(key => key !== 'headers' && key !== 'url')
        const data: {[key: string]: any} = {}
        for(const key of keys) { 
            const value = args[key]
            data[key] = value
        }
        
        try { 
            const res = await axios.put(url, data, {headers: headers})
            return res
        }catch(error) { 
            if(error instanceof AxiosError) {
                return error.response
            }
        }
    },
    delete : async ({...args}) => { 
        const {url, headers} = args
        try { 
            const res = await axios.delete(url, {headers: headers})
            return res
        }catch(error) { 
            if(error instanceof AxiosError) {
                return error.response
            }
        }
    }
}


// describe("authentication", ()=> { 
//     it("user should be able to sign up", async ()=> {
//         const username = "raja" + Math.random() 
//         const password = "there"
//         const type = "user"
//         const response = await axios.post(`${URL}/api/v1/users/signup`, { 
//             username,
//             password,
//             type
//         })
//         //console.log(response)
//         expect(response.status).toBe(201)
//     })
//     it("user should be able to sign in with correct cred", async () => { 
//         const username = "raja" + Math.random() 
//         const password = "pass" + Math.random()
//         const type = "user"
//         const response = await HttpClient.post({
//             url: `${URL}/api/v1/users/signup`,  
//             username,
//             password,
//             type
//         })
//         if(response) expect(response.status).toBe(201)
//         const signInResponse = await HttpClient.post({ 
//             url: `${URL}/api/v1/users/signin`,  
//             username, 
//             password
//         })
//         if(signInResponse) {
//             expect(signInResponse.status).toBe(200)
//             expect(signInResponse.data.token).toBeDefined()
//         }
//     })
//     it("user won't be able to sign in with incorrect cred", async () => { 
//         const username = "raja" + Math.random() 
//         const password = "pass" + Math.random()
//         const type = "user"
//         const response = await HttpClient.post({
//             url: `${URL}/api/v1/users/signup`,  
//             username,
//             password,
//             type
//         })
//         if(response) expect(response.status).toBe(201)
//         const signInResponse = await HttpClient.post({ 
//             url: `${URL}/api/v1/users/signin`,  
//             username:'rajahello', 
//             password
//         })
//         if(signInResponse) {
//             expect(signInResponse.status).toBe(403)
            
//         } 
        
//     })
// })




// describe("update user metadata", ()=> {
//     let token = ""
//     let avatarId = ""
//     beforeAll(async () => { 
//         const username = "raja" + Math.random() 
//         const password = "pass" + Math.random()
//         const type = "admin"
//         const response = await HttpClient.post({
//             url: `${URL}/api/v1/users/signup` ,
//             username,
//             password,
//             type
//         })
//         if(response) expect(response.status).toBe(201)
//         const signInResponse = await HttpClient.post({url: `${URL}/api/v1/users/signin`,  
//             username, 
//             password
//         })
        
//         token = signInResponse?.data.token
//         console.log(token)
//         const createAvatarResponse  = (await HttpClient.post({url: `${URL}/api/v1/admin/avatar`, 
//             "imageUrl" : "",
//             "name" : "timmy",
        
//             headers: { 
//                 Authorization: `Bearer ${token}`
//             }
//         }))
//         console.log(createAvatarResponse === undefined)
//         if(createAvatarResponse) { 
//             console.log("here here herere hererh herere ")
//             console.log(createAvatarResponse.status)
//             console.log("in test avator id " + createAvatarResponse.data.avatorId)
//             avatarId = createAvatarResponse.data.avatorId
//         }
//     })
//     it("user shoud be able to update avatarWith a valid avatarID", async ()=> {
//         const response = await HttpClient.post({url: `${URL}/api/v1/users/metadata`, 
//             avatarId,     
//             headers: { 
//                 Authorization:  `Bearer ${token}`
//             }
//         })
//         console.log(response?.status)
//         expect(response?.status).toBe(200)
//     })
    
//     it("user won't be able to update avatar metadata if unauthorized", async () => { 
//         const response = await HttpClient.post({url: `${URL}/api/v1/users/metadata`, 
//             avatarId
//         })
//         console.log(response?.status)
//         expect(response?.status).toBe(401)
//     })
// })



// describe("available users metadata" , ()=> { 
//     let token: string;
//     let avatarId: string;
//     let userId: string;
//     beforeAll(async () => { 
//         const username = "raja" + Math.random() 
//         const password = "pass"
//         const type = "admin"
//         try { 
//             const response = await HttpClient.post({url: `${URL}/api/v1/users/signup`,  
//                 username,
//                 password,
//                 type
//             })
//             if(response) { 
//                 userId = response.data.id;
//                 console.log("user id " + userId)
//                 expect(userId).toBeDefined()
//                 expect(response.status).toBe(201)
//             }
//             const signInResponse = await HttpClient.post({url: `${URL}/api/v1/users/signin`,  
//                 username, 
//                 password
//             })
//             if(signInResponse) token = signInResponse.data.token
//             const createAvatorResponse = await HttpClient.post({url: `${URL}/api/v1/admin/avatar`,
//                 imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
//                 name: "Timmy",
//                 headers: { 
//                     Authorization: `Bearer ${token}`
//                 }
//             })
//             if(createAvatorResponse) { 
//                 console.log(createAvatorResponse.data)
//                 avatarId = createAvatorResponse.data.avatorId
//             }
//         } catch(error) {
//             if(error instanceof AxiosError) { 
//                 console.log(error.response?.data)
//             }
//         }
//     })
//     it("get list of avatars" , async () => { 
//         const response = await HttpClient.get({url: `${URL}/api/v1/users/bulk?ids=[${userId}]`})
//         if(response) { 
//             expect(response.status).toBe(200)
//             expect(response.data.avatars.length).toBe(1)
//         }
            
//     })
//     it("available avatars should contain the currently created avatars" , async () => { 
//         const response = await HttpClient.get({url: `${URL}/api/v1/users/bulk?ids=[${userId}]`})
//         if(response) { 

//             console.log(response.data)
//             const currentAvatar = response.data.avatars.find((a: any ) => a.userId === userId)
//             console.log(currentAvatar)
//             expect(currentAvatar).toBeDefined()
//         } 
//     })
// })

// describe("space endpoints" , ()=> { 
//     let admintoken = ""
//     let userToken = ""
//     let element1Id = "";
//     let element2Id = "";
//     let userId = "";
//     let adminId = ""
//     let mapId = "";
//     let spaceId = ""
//     beforeAll(async () => { 
//         const username = "raja" + Math.random() 
//         const password = "pass"
//         const response = await HttpClient.post({url: `${URL}/api/v1/users/signup`,  
//             username,
//             password,
//             type: 'admin'
//         })
//         if(response) { 
//             adminId = response.data.userId;
//             expect(response.status).toBe(201)
//         }
//         const signInResponse = await axios.post(`${URL}/api/v1/users/signin`, { 
//             username, 
//             password
//         })

//         if(signInResponse) admintoken = signInResponse.data.token

//         // create an user 
//         const userResponse = await HttpClient.post({url: `${URL}/api/v1/users/signup`,  
//             username: username + "_user",
//             password,
//             type: 'user'
//         })
//         if(userResponse) { 
//             userId = userResponse.data.userId;
//             expect(userResponse.status).toBe(201)
//         }
//         const userSignInResponse = await axios.post(`${URL}/api/v1/users/signin`, { 
//             username: username + "_user", 
//             password
//         })

//         if(userSignInResponse) userToken = userSignInResponse.data.token
        
//         // create a few elements for the map
//         let element1 = (await HttpClient.post({url: `${URL}/api/v1/admin/element`,
//             "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
//             "width": 1,
//             "height": 1,
//           "static": true ,// weather or not the user can sit on top of this element (is it considered as a collission or not)
//             headers:{ Authorization : `Bearer ${admintoken}`}
//         }))?.data
//         let element2 = (await HttpClient.post({url: `${URL}/api/v1/admin/element`,
//             "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
//             "width": 2,
//             "height": 2,
//           "static": true ,// weather or not the user can sit on top of this element (is it considered as a collission or not)
//             headers:{ Authorization : `Bearer ${admintoken}`}
//         }))?.data
//         element1Id = element1.elementId
//         element2Id = element2.elementId
//         console.log(element1Id + " " + element2Id)
//         const map  = (await HttpClient.post({url: `${URL}/api/v1/admin/map`, 
//             "thumbnail": "https://thumbnail.com/a.png",
//             "dimensions": "100x200",
//             "name": "100 person interview room",
//             "defaultElements": [{
//                     elementId: element1Id,
//                     x: 20,
//                     y: 20
//                 }, {
//                   elementId: element2Id,
//                     x: 18,
//                     y: 20
//                 }
//             ], 
//             headers: {Authorization: `Bearer ${admintoken}`}
//         }))?.data
//         console.log(map)
//         mapId = map.mapId
//     })
//     it("user is able ot create an empty space i.e without a map id" , async () => { 
//         console.log('user token' + userToken)
//         const createdSpaceResponse = await HttpClient.post({
//             url: `${URL}/api/v1/space`,
//             name: "test",
//             dimensions: "100x200",
//             headers: { 
//                 Authorization: `Bearer ${userToken}`
//             }
//         })
//         console.log("space created")
//         if(createdSpaceResponse) { 
       
//             expect(createdSpaceResponse.status).toBe(201)
           
//             expect(createdSpaceResponse.data.spaceId).toBeDefined()
//             spaceId = createdSpaceResponse.data.spaceId
//         }
//     })
//     it("create a space with a map id", async ()=> { 
//         console.log(mapId)
//         const response = await HttpClient.post({url: `${URL}/api/v1/space`, 
//             "name": "Test",
//           "dimensions": "100x200",
//           "mapId": mapId, 
//         headers : { Authorization: `Bearer ${userToken}`}
//        })
//        if(response) { 
//         console.log(response.data)
//         expect(response.status).toBe(201)
//         expect(response.data.spaceId).toBeDefined()
        
//        }
//     })
//     it("delete a space", async ()=> { 
//         const response = await HttpClient.post({url: `${URL}/api/v1/space`,
//             "name": "Test",
//           "dimensions": "100x200",
//           "mapId": mapId,
//             headers: { Authorization: `Bearer ${userToken}`}
//        })
//        const deletedResponse = await axios.delete(`${URL}/api/v1/space/${response?.data.spaceId}`, {
//         headers: {Authorization: `Bearer ${userToken}`}
//        })
//        expect(deletedResponse.status).toBe(200)
//     })
//     it("user will be able to get all spaces", async ()=> {
//         console.log("spaceID " + spaceId) 
//         const response = await HttpClient.get({
//             url: `${URL}/api/v1/space/all`,
//             headers: { Authorization: `Bearer ${userToken}`}
//         })
//         if(response) { 
//             console.log(response.data)
//             expect(response.status).toBe(200)
//             console.log(response.data.spaces.map((space: any ) => space.id))
//             const space = response.data.spaces.filter((space: any) => space.id === spaceId)
//             console.log(space)
//             expect(space).toBeDefined()
//         }
//     } )
//     it("user will be able to get space with spaceId", async ()=> { 
//         const response = await HttpClient.get({
//             url: `${URL}/api/v1/space/${spaceId}`,
//             headers: { Authorization: `Bearer ${userToken}`}
//         })
//         if(response) { 
//             console.log(response.data)
//             expect(response.status).toBe(200)
//             const space = response.data.space
//             console.log(space)
//             expect(space).toBeDefined()
//         }
//     } )
//     it('get all available elements' , async () => { 

//         // create an empty space
//         console.log('user token' + userToken)
//         const createdSpaceResponse = await HttpClient.post({
//             url: `${URL}/api/v1/space`,
//             name: "demo space",
//             dimensions: "120x200",
//             headers: { 
//                 Authorization: `Bearer ${userToken}`
//             }
//         })
//         const anotherSpaceId = createdSpaceResponse?.data.spaceId

//         // add a bunch of space elements
//         const addSpaceElResponse1 = await HttpClient.post({
//             url: `${URL}/api/v1/space/element`,
//             spaceId: anotherSpaceId,
//             elementId: element1Id,
//             x: 20,
//             y: 20,
//             headers: { Authorization: `Bearer ${userToken}`}
//         })
//         const addSpaceElResponse2 = await HttpClient.post({
//             url: `${URL}/api/v1/space/element`,
//             spaceId: anotherSpaceId,
//             elementId: element2Id,
//             x: 20,
//             y: 20,
//             headers: { Authorization: `Bearer ${userToken}`}
//         })
//         const response = await HttpClient.get({ 
//             url: `${URL}/api/v1/space/elements/all`,
//             headers: { Authorization: `Bearer ${userToken}`}
//         })
//         if(response) { 
//             console.log(response.data)
//             expect(response.status).toBe(200)
//             expect(response.data.elements.length).not.toBe(0)
//         }
//     })
//     it("user will be able to update space element", async() => { 

//     })
// })


// describe('admin endpoints', ()=> { 
//     let admintoken = ""
//     let userToken = ""
//     let element1Id = "";
//     let element2Id = "";
//     let userId = "";
//     let adminId = ""
//     let mapId = "";
    
//     beforeAll(async () => { 
//         const username = "raja" + Math.random() 
//         const password = "pass"
//         const response = await HttpClient.post({url: `${URL}/api/v1/users/signup`,  
//             username,
//             password,
//             type: 'admin'
//         })
//         if(response) { 
//             adminId = response.data.userId;
//             expect(response.status).toBe(201)
//         }
//         const signInResponse = await axios.post(`${URL}/api/v1/users/signin`, { 
//             username, 
//             password
//         })

//         if(signInResponse) admintoken = signInResponse.data.token

//         // create an user 
//         const userResponse = await HttpClient.post({url: `${URL}/api/v1/users/signup`,  
//             username: username + "_user",
//             password,
//             type: 'user'
//         })
//         if(userResponse) { 
//             userId = userResponse.data.userId;
//             expect(userResponse.status).toBe(201)
//         }
//         const userSignInResponse = await axios.post(`${URL}/api/v1/users/signin`, { 
//             username: username + "_user", 
//             password
//         })

//         if(userSignInResponse) userToken = userSignInResponse.data.token
        
//         // create a few elements for the map
//         let element1 = (await HttpClient.post({url: `${URL}/api/v1/admin/element`,
//             "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
//             "width": 1,
//             "height": 1,
//             "static": true ,// weather or not the user can sit on top of this element (is it considered as a collission or not)
//             headers:{ Authorization : `Bearer ${admintoken}`}
//         }))?.data
//         let element2 = (await HttpClient.post({url: `${URL}/api/v1/admin/element`,
//             "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
//             "width": 2,
//             "height": 2,
//             "static": true ,// weather or not the user can sit on top of this element (is it considered as a collission or not)
//             headers:{ Authorization : `Bearer ${admintoken}`}
//         }))?.data
//         element1Id = element1.elementId
//         element2Id = element2.elementId
//         console.log(element1Id + " " + element2Id)
//         const map  = (await HttpClient.post({url: `${URL}/api/v1/admin/map`, 
//             "thumbnail": "https://thumbnail.com/a.png",
//             "dimensions": "100x200",
//             "name": "100 person interview room",
//             "defaultElements": [{
//                     elementId: element1Id,
//                     x: 20,
//                     y: 20
//                 }, {
//                     elementId: element2Id,
//                     x: 18,
//                     y: 20
//                 }
//             ], 
//             headers: {Authorization: `Bearer ${admintoken}`}
//         }))?.data
//         console.log(map)
//         mapId = map.mapId
//     })
//     it("user will be able to update element", async () => {
//         console.log("admin token " + admintoken) 

//         const response = await HttpClient.put({ 
//             url: `${URL}/api/v1/admin/element/${element1Id}`,
//             imageUrl: "",
//             headers: {Authorization: `Bearer ${admintoken}`}
//         })
//         if(response) { 
//             console.log(response.data)
//             expect(response.status).toBe(200)
//         }
//     })

// })