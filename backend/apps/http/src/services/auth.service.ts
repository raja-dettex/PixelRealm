
import { IUserService } from './user.service';
import { SigninSchema, SigninSchemaType } from '../types/types';
import bcrypt from 'bcrypt'
import jwt, {JwtPayload} from 'jsonwebtoken'
import { ErrorInvalidUser, ErrorUserNotFound, SignInError } from '../types/errors';

export interface IAuthService { 
    getToken(user: SigninSchemaType): Promise<string | Error>
    validateToken(token: string): Promise<{isValid: boolean, id: string}>
    
} 


export class AuthService implements IAuthService { 
    userService : IUserService 
    constructor(userService: IUserService) {
        this.userService = userService
    }
    async getToken(user: SigninSchemaType) : Promise<string> { 
        // validate that user exists
        try {
            const existingUser = await this.userService.getUserByUsername(user.username)
            if(existingUser) {
                if(bcrypt.compareSync(user.password, existingUser.password)) {
                    // create a jwt token and return 
                    const token = jwt.sign({username: existingUser.username, id: existingUser.id}, 'secret', {expiresIn: '1d'})
                    return token
                } else { 
                    throw new ErrorInvalidUser("Invalid password")
                }
            } else { 
                throw new ErrorUserNotFound("userd does not exist")
            }
        } catch(error) {
            throw new ErrorUserNotFound("Error fetchin user ")
        }
    }

    async validateToken(token: string): Promise<{isValid: boolean, id: string}> { 
        try { 
            const decoded = jwt.verify(token, 'secret')
            if(typeof decoded ===  'object' && 'username' in decoded && 'id' in decoded)  {
                const user = await this.userService.getUserByUsername(decoded.username)
                if(user) return {isValid: true, id: user.id}
            }
            return {isValid: false, id: ''}
        } catch(error) { 
            throw new SignInError('invalid token')
        }
    }
}