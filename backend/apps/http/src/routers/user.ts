import Router, {Request, Response} from 'express'
import { UserService } from '../services/user.service'
import { SigninSchema, SignupSchema, UpdateMetadataSchema } from '../types/types'
import { ErrorInvalidUser, ErrorUserNotFound, SignInError, SignUpError } from '../types/errors'
import { AuthService } from '../services/auth.service'
import { userAuth } from '../middlewares/user.auth.middlewares'
import { userService, authService } from '../index'


export const UserRouter = Router()



UserRouter.post('/signup', async (req: Request, res: Response) => {
  try {  
    const { username, password, type } = req.body
    const user = SignupSchema.parse({username, password, type})
    const createdUser = await userService.addUser(user)
    res.status(201).json(createdUser)
  } catch(error) { 
    if(error instanceof SignUpError) { 
      res.status(400).json({error: error.message})
    }
  }
      
})

UserRouter.post('/signin', async (req: Request, res: Response) => { 
    try { 
      const user = SigninSchema.parse(req.body)
      const token = await authService.getToken(user)
      res.status(200).json({token})
    } catch(error) { 
      if(error instanceof SignInError || error instanceof  ErrorUserNotFound || error instanceof  ErrorInvalidUser) { 
        res.status(403).json({error: error.message})
      }
    }
})

UserRouter.post('/metadata',userAuth, async (req: Request, res: Response) => {
    const data = UpdateMetadataSchema.safeParse(req.body)
    if(!data.success) { 
      res.status(400).json({message: 'validation failed'})
      return
    }
    const userId = req.userId;
    if(userId) { 
      if(data.data) { 
        try { 
          const userMetadata = await userService.updateMetadata(userId, data.data)
          res.status(200).json({message: "user metadata updated"})
          return
        } catch(error) { 
          if(error instanceof Error) { 
            res.status(400).json({message: error.message})
            return
          }
        }
      }
    }
    res.status(401).json({message: 'unauthorized'})
    return
});
  


UserRouter.get('/bulk', async (req: Request, res: Response) => {
  
  const userIdstring = ( req.query.ids ?? '[]' ) as string

  const userIds = userIdstring.slice(1, userIdstring?.length - 1).split(',')
  try { 
    const userAvatars  = await userService.getAvatarsByUserIds(userIds)
    res.status(200).json({avatars: userAvatars})
  } catch(error) {
    if(error instanceof Error)  res.status(400).json({error: error.message})
  }
});
  