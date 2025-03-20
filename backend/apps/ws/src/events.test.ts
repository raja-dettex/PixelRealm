// import { SpaceEventEmitter } from "./spaceEventEmitter"

// describe("test our new emitter" , ()=> { 
//     const emitter = SpaceEventEmitter.getInstance()
//     it("test the typed emitter" , async () => {
//         await new Promise<void>((resolve, reject) => {
//             setTimeout(() => reject("timeout"), 3000)
//             const listener = (data: any) => { 
//                 console.log(data)
//             }
//             emitter.listen(listener)
//             console.log("done listening")
//             resolve()
//         })
//         emitter.dispatch("user-join", {userId : "this is userId"})
//     })
// })