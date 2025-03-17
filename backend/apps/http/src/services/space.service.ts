import { Element, Space, SpaceElements } from '@prisma/client'
import {client} from '../db/client/client'
import { AddElementSchemaType, CreateSpaceSchemaType, ElementResponse, SpaceType } from '../types/types'

export interface ISpaceService { 
    createSpace(userId: string, space: CreateSpaceSchemaType) : Promise<Space>
}

export class SpaceService implements ISpaceService { 
    async createSpace(userId : string, data: CreateSpaceSchemaType): Promise<Space> {
        
        const dimensions = data.dimensions.split('x')
        try { 
            if(!data.mapId) { 
                const spaceCreated = await client.space.create({
                    data: { 
                        name: data.name,
                        height: parseInt(dimensions[1]),
                        width: parseInt(dimensions[0]),
                        creatorId: userId
                    }
                })
                return spaceCreated 
            } 
            const map = await client.map.findFirst({
                where: { 
                    id: data.mapId
                },
                select: { 
                    mapElements: true,
                    width: true,
                    height: true
                }
            })
            if(!map) { 
                throw new Error("map does not exist with the given map id")
    
            }
            
            const spaceCreated: Space = await client.$transaction(async () => { 
                const space = await client.space.create({
                    data: { 
                        name: data.name, 
                        height: parseInt(dimensions[1]),
                        width: parseInt(dimensions[0]),
                        creatorId: userId
                    }
                })
                

                const spaceElements = await client.spaceElements.createMany({
                    data: map.mapElements.map(el => {
                        return { 
                        spaceId: space.id,
                        elementId: el.elementId,
                        x: el.x!,
                        y: el.y!
                    }})
                })
                return space
            })
            return spaceCreated

        } catch(error) { 
            
            if(error instanceof Error) throw new Error(error.message)
            throw new Error("error creating space")
        }
    }
    async deleteSpace(userId: string, spaceId : string): Promise<string> {
        
        try { 
            const id = await client.$transaction(async () => { 
                const space = await client.space.findUnique({ 
                    where: { 
                        id: spaceId,
                    },
                    select : {
                        creatorId: true 
                    }
                })
                if(userId !== space?.creatorId) { 
                    return null
                }
                const spaceElementsDeleted = await client.spaceElements.deleteMany({
                    where: { spaceId: spaceId}
                })
                const spaceDeleted = await client.space.delete({
                    where: { 
                        id: spaceId
                    }
                })
                return spaceDeleted.id
            })
            
            if(id=== null) throw new Error("not the creator of the given space")
            return id
        } catch(error) { 
            if(error instanceof Error) throw new Error(error.message)
            throw new Error("error deleting space")
        }
    }
    async getAllSpaces(): Promise<Space[]> {
        
        try { 
            const spaces = await client.space.findMany({
                include: { 
                    spaceElements: { 
                        include: {
                            element: true
                        }
                    }
                }
            })
        
            return spaces
        } catch(error) { 
            console.log(error)
            throw new Error("error creating space")
        }
    }
    async getSpace(userId: string, spaceId : string): Promise<SpaceType | null> {
        
        try { 
            const space = await client.space.findUnique({
                where: { 
                    id: spaceId
                },
                include: {
                    spaceElements: { 
                        include: { 
                            element: true
                        }
                    }
                }
            })
           
            if(!space) throw new Error("space not found for the given user and space id")
            const elements = space.spaceElements.map((el: any) => ({
                id: el.element.id,
                imageUrl: el.element.imageUrl,
                width: el.element.width,
                height: el.element.height,
                static: el.element.static
            }))
            return { 
                dimensions: `${space.width}x${space.height}`,
                elements
            }
        } catch(error) { 
            if(error instanceof Error) throw new Error(error.message)
            throw new Error("error getting space")
        }
    }
    async addSpaceElement(userId: string, spacElement: AddElementSchemaType) : Promise<SpaceElements> { 
        const {spaceId, elementId, x, y } = spacElement
        try { 
            const spaceEl = await client.$transaction(async () => { 
                const space = await client.space.findUnique({
                    where: { 
                        id: spaceId,
                        creatorId: userId
                    },
                    select: { 
                        height: true,
                        width: true
                    }
                })
                if(!space) throw new Error("space does not exist for the given space id")
                if(x < 0 || y < 0 || x > space?.height! || y > space?.width) { 
                    throw new Error("element is outside the space bounds")
                }
                const spaceEl = await client.spaceElements.create({
                    data: { 
                        elementId,
                        spaceId,
                        x,
                        y 
                    }
                })
                return spaceEl

            })
            return spaceEl
        } catch(error) { 
            console.log(error)
            throw new Error("error creating space")
        }
    }

    async deleteSpaceElement(userId: string, elementId: string) : Promise<string> { 
        try { 
            const id = await client.$transaction(async () => { 
                const spaceElement = await client.spaceElements.findFirst({
                    where : { 
                        id: elementId
                    },
                    select: { 
                        space: true
                    }
                })
                if(spaceElement?.space.creatorId !== userId) { 
                    return null
                }
                const space = await client.spaceElements.delete({
                    where: { 
                        id: elementId
                    }
                })
                return space.id
            })
            if(id === null) throw new Error("not the actual user")
            return id
            
        } catch(error) { 
            console.log(error)
            throw new Error("error creating space")
        }
    }
    async getAllSpaceElements(): Promise<ElementResponse[] | undefined> {
        
        try { 
            
            const spaces = await client.space.findMany({ 
                include: { 
                    spaceElements: {include: { element: { 
                        select: { 
                            id: true,
                            width: true,
                            height: true,
                            imageUrl: true,
                            static: true
                        }   
                    }}}
                }
            })
            //const a = spaces?.flatMap(space => space.spaceElements)
            return spaces?.flatMap(space => space.spaceElements).map(el => { 
                return { 
                    id: el.element.id,
                    width: el.element.width,
                    height: el.element.height,
                    imageUrl: el.element.imageUrl,
                    static: el.element.static 
                }
            })
        } catch(error) { 
            console.log("error find space elements " + error)
            if(error instanceof Error) throw new Error(error.message)
            throw new Error("error finding all space elements")
        }
    }
}