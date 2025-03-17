import express from 'express';
import { UserService } from './services/user.service';
import { AuthService } from './services/auth.service';
import { AdminService } from './services/admin.service';
import { SpaceService } from './services/space.service';

const app = express();
export const userService  = new UserService()
export const authService = new AuthService(userService)
export const adminService = new AdminService()
export const spaceService = new SpaceService()
// middleware to parse json body
app.use(express.json())


// routers

import {UserRouter} from './routers/user'
import {SpaceRouter} from './routers/space'
import {AdminRouter} from './routers/admin'

app.use('/api/v1/users' , UserRouter)
app.use('/api/v1/space' , SpaceRouter)
app.use('/api/v1/admin' , AdminRouter)

app.listen(3000 , ()=> { 
    console.log('server is running on port 3000')
})