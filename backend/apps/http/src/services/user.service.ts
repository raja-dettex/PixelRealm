import {client} from '../db/client/client';
import {Avatar, SignedupUser, SigninSchema, SignupSchema, SignupSchemaType, UpdateMetadataSchema, UpdateMetadataSchemaType, UserAvatar } from './../types/types'
import { User } from '@prisma/client';
import { ErrorUserNotFound, SignUpError } from '../types/errors';
import bcrypt from 'bcrypt'
export interface IUserService { 
    addUser(user: SignupSchemaType): Promise<User>
    updateMetadata(username: string, updateUserMetadata: UpdateMetadataSchemaType): Promise<void | Error>
    getOtherUsersMetadata(userIds: string[]): Promise<UserAvatar[]>
    getUserByUsername(username: string) : Promise<SignedupUser | null>
    checkIfUserAdmin(userId: string) : Promise<boolean>
    getAvatarsByUserIds(userIds: string[]): Promise<UserAvatar[]>
}

export class UserService implements  IUserService { 
    async addUser(user: SignupSchemaType): Promise<User> {
        try {
            const userCreated  = await client.user.create({
                data: {
                    username: user.username,
                    password: bcrypt.hashSync(user.password , 8),
                    role: (user.type   === 'admin') ? 'Admin' : 'User'
                }
            })
            return userCreated
        } catch(error) { 
            console.log(error)
            throw new SignUpError("Error creating user")
        }
    }
    
    async updateMetadata(userId: string, updateMetadata: UpdateMetadataSchemaType): Promise<void> {
        try {
            const updated = await client.user.update({
                where: {
                    id: userId
                },
                data: {
                    avatarId: updateMetadata.avatarId
                }
            })
        } catch (error) {
            throw new Error('Error updating metadata') 
        }
    }
    
    async getOtherUsersMetadata(userIds : string[]): Promise<UserAvatar[]> {
        try { 
            const avatars = (await client.avatar.findMany(
                {
                    where: { 
                        userId: { 
                            in: userIds
                        }
                    },
                    select: { 
                        userId: true,
                        imageUrl: true
                    }
                }
            )).map((avatar:any) => { 
                return { 
                    ...avatar,
                    userId: parseInt(avatar.userId)
                }
            });
            return avatars
        } catch(error) { 
            throw new Error("Error fetching other users metadata")

        }
    }

    async getUserByUsername(username: string): Promise<SignedupUser| null> {
        try {
            const user = await client.user.findUnique({
                where: {
                    username: username
                }
            })
            if(!user) return null
            return {"id" : user.id, "username": user.username, "password": user.password}
            
        } catch(error) { 
            throw new ErrorUserNotFound("Error fetching user by username")
        }
    }

    async checkIfUserAdmin(userId: string) : Promise<boolean> { 
        const user = await client.user.findUnique({
            where: {
                id: userId
            }
        })
        return user?.role === 'Admin'
    }

    async getAvatarsByUserIds(userIds: string[]): Promise<UserAvatar[]> {
        try { 
            const avatars = (await client.user.findMany({
                where: {
                    id: {
                        in: userIds
                    },
                    
                },
                select: {
                    id: true,
                    avatar: true
                }
            })).map(user => ({userId: user.id, imageUrl: user.avatar?.imageUrl || null}))
            return avatars
        } catch(error) { 
            throw new Error("Error fetching avatars by user ids")
        }
    }
}