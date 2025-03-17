import Router, {Request, Response} from 'express'
import { CreateAvatarSchema, CreateElementSchema, CreateMapSchema, UpdateElementSchema } from '../types/types';
import { adminService, userService } from '..';
import { userAuth } from '../middlewares/user.auth.middlewares';
export const AdminRouter = Router()

AdminRouter.post('/element', userAuth, async (req: Request, res: Response) => {
    const data = CreateElementSchema.safeParse(req.body)
    if(!data.success) { 
      res.status(400).json({message: 'validation failed'})
      return
    }
    if(!req.userId) { 
      res.status(401).json({message: 'invalid request'})
      return
    } else { 
      const userId = req.userId;
      if((await userService.checkIfUserAdmin(userId))) { 
        if(data.data) { 
          try { 
            const elementId = await adminService.createElement(data.data)
            res.status(201).json({elementId})
            return
          } catch(error) { 
            res.status(400).json({message: error})
            return
          }
        }
      } else { 
        res.status(400).json({message: 'user is not admin'})
        return
      }
    }   
});
  
AdminRouter.put('/element/:elementId', userAuth, async (req: Request, res: Response) => {
  const {elementId} = req.params
  const data = UpdateElementSchema.safeParse(req.body)
  if(!data.success) { 
    res.status(400).json({message: 'validation failed'})
    return
  }
  if(!req.userId) { 
    res.status(401).json({message: 'invalid request'})
    return
  } else { 
    const userId = req.userId;
    if((await userService.checkIfUserAdmin(userId))) { 
      if(data.data && elementId) { 
        try { 
          const id = await adminService.updateElement(elementId, data.data)
          res.status(200).json({elementId:  id})
          return
        } catch(error) { 
          res.status(400).json({message: error})
          return
        }
      }
    } else { 
      res.status(400).json({message: 'user is not admin'})
      return
    }
  }   
});

AdminRouter.post('/avatar', userAuth, async (req: Request, res: Response) => {
  const data = CreateAvatarSchema.safeParse(req.body)
  if(!data.success) { 
    res.status(400).json({message: 'validation failed'})
    return
  }
  if(!req.userId) { 
    res.status(401).json({message: 'invalid request'})
    return
  } else {
    const userId = req.userId
    
    if(userId && (await userService.checkIfUserAdmin(userId))) {
      
      try { 
        if(data.data) { 
          const avatorId = await adminService.createAvator(userId, data.data);
          
          res.status(200).json({avatorId})
          return
        } else { 
          res.status(400).json({message: 'invalid request'})
          return
        }
      } catch(error) { 
        if(error instanceof Error) { 
          res.status(400).json({message: error.message})
          return
        }
      }  
    } else { 
      
      res.status(401).json({message: 'invalid request'})
      return 
    }
  }
});

AdminRouter.post('/map', userAuth , async (req: Request, res: Response) => {
  const data = CreateMapSchema.safeParse(req.body)
    if(!data.success) { 
      res.status(400).json({message: 'validation failed'})
      return
    }
    if(!req.userId) { 
      res.status(401).json({message: 'invalid request'})
      return
    } else { 
      const userId = req.userId;
      if((await userService.checkIfUserAdmin(userId))) { 
        if(data.data) { 
          try { 
            const mapId = await adminService.createMap(data.data)
            res.status(201).json({mapId})
            return
          } catch(error) { 
            res.status(400).json({message: error})
            return
          }
        }
      } else { 
        res.status(400).json({message: 'user is not admin'})
        return
      }
    }   
});