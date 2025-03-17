import z from "zod";

export const SignupSchema = z.object({
    username: z.string(),
    password: z.string(),
    type: z.enum(["user", "admin"]),
})

export const SigninSchema = z.object({
    username: z.string(),
    password: z.string(),
})

export const UpdateMetadataSchema = z.object({
    avatarId: z.string()
})

export const CreateSpaceSchema = z.object({
    name: z.string(),
    dimensions: z.string().regex(/^[0-9]{1,4}x[0-9]{1,4}$/),
    mapId: z.string().optional(),
})

export const DeleteElementSchema = z.object({
    id: z.string(),
})

export const AddElementSchema = z.object({
    spaceId: z.string(),
    elementId: z.string(),
    x: z.number(),
    y: z.number(),
})

export const CreateElementSchema = z.object({
    imageUrl: z.string(),
    width: z.number(),
    height: z.number(),
    static: z.boolean(),
})

export const UpdateElementSchema = z.object({
    imageUrl: z.string(),
})

export const CreateAvatarSchema = z.object({
    name: z.string(),
    imageUrl: z.string(),
})

export const CreateMapSchema = z.object({
    thumbnail: z.string(),
    dimensions: z.string().regex(/^[0-9]{1,4}x[0-9]{1,4}$/),
    name: z.string(),
    defaultElements: z.array(z.object({
        elementId: z.string(),
        x: z.number(),  
        y: z.number(),
    }))
})



namespace Express {
    export interface Request {
        user: {
            id: string
            role?: "Admin" | "User"
        }
    }
}


export type SignupSchemaType = z.infer<typeof SignupSchema>
export type SigninSchemaType = z.infer<typeof SigninSchema>
export type UpdateMetadataSchemaType = z.infer<typeof UpdateMetadataSchema>
export type CreateSpaceSchemaType = z.infer<typeof CreateSpaceSchema>
export type DeleteElementSchemaType = z.infer<typeof DeleteElementSchema>
export type AddElementSchemaType = z.infer<typeof AddElementSchema>
export type CreateElementSchemaType = z.infer<typeof CreateElementSchema>
export type UpdateElementSchemaType = z.infer<typeof UpdateElementSchema>
export type CreateAvatarSchemaType = z.infer<typeof CreateAvatarSchema>
export type CreateMapSchemaType = z.infer<typeof CreateMapSchema>


export interface Avatar { 
    id: string
    name: string
    imageUrl: string
}

export interface UserAvatar { 
    userId: string,
    imageUrl: string | null
}

export interface SignedupUser { 
    id: string, 
    username: string, 
    password: string
}


export interface SpaceType { 
    dimensions: string, 
    elements: { 
        id: any,
        imageUrl: any,
        width: any,
        height: any,
        static: any
    }[]
}

export interface ElementResponse extends CreateElementSchemaType{ 
    id: string
}

declare global {
    namespace Express { 
        interface Request { 
            userId?: string
        }
    }
}