import { CreateAvatarSchemaType, CreateElementSchemaType, CreateMapSchemaType, UpdateElementSchemaType, UpdateMetadataSchemaType } from '../types/types'
import {client} from '../db/client/client'

export interface IAdminService { 
    createAvator(userId: string, data: CreateAvatarSchemaType): Promise<string>
    createElement(data: CreateElementSchemaType) : Promise<string>
    createMap(data: CreateMapSchemaType) : Promise<string>
    updateElement(elementId: string, data: UpdateElementSchemaType): Promise<string>
}

export class AdminService implements IAdminService { 
    async createAvator(userId: string, data: CreateAvatarSchemaType): Promise<string> { 
        try {
            const avatar = await client.avatar.create({
                data: { 
                    name: data.name, 
                    imageUrl: data.imageUrl,
                    userId
                }
            })
            return avatar.id
        } catch(error) { 
            throw new Error('Error creating avator')
        }
    }
    async createElement( data: CreateElementSchemaType): Promise<string> { 
        try {
            const element = await client.element.create({
                data: { 
                    width: data.width,
                    height: data.height,
                    imageUrl: data.imageUrl,
                    static: data.static
                }
            })
            return element.id
        } catch(error) { 
            throw new Error('Error creating avator')
        }
    }
    async createMap( data: CreateMapSchemaType): Promise<string> { 
        try {
            const dimensions  = data.dimensions.split('x')
            const map = await client.map.create({
                data: { 
                    width: parseInt(dimensions[0]),
                    height: parseInt(dimensions[1]),
                    name: data.name,
                    thumbnail: data.thumbnail,
                    mapElements: {
                        create: data.defaultElements.map((el) => ({ 
                                elementId: el.elementId,
                                x: el.x,
                                y: el.y 
                        
                                }))
                }
            }})
            
            return map.id
        } catch(error) { 
            throw new Error('Error creating avator')
        }
    }

    async updateElement( elementId: string, data: UpdateElementSchemaType): Promise<string> { 
        try {
            const updatedElement = await client.element.update({
                where: { 
                    id: elementId
                },
                data: { 
                    imageUrl: data.imageUrl
                }
            })
            return updatedElement.id
        } catch(error) { 
            throw new Error('Error creating avator')
        }
    }
}

