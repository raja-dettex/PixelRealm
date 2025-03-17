import Router, { Request, Response } from 'express'
import { AddElementSchema, CreateSpaceSchema, DeleteElementSchema } from '../types/types';
import { spaceService } from '..';
import { userAuth } from '../middlewares/user.auth.middlewares';

// Space Router
export const SpaceRouter = Router();

SpaceRouter.post('/', userAuth, async (req: Request, res: Response) => {
  const data = CreateSpaceSchema.safeParse(req.body)
  if (!data.success) {
    res.status(400).json({ message: 'validation failed' })
    return
  }
  if (!req.userId) {
    res.status(401).json({ message: 'invalid request' })
    return
  } else {
    const userId = req.userId;
    if (data.data) {
      try {
        const space = await spaceService.createSpace(userId, data.data)
        res.status(201).json({ spaceId: space.id })
        return
      } catch (error) {
        
        if(error instanceof Error) res.status(400).json({ message: error.message })
        return
      }
    }
  }
});

SpaceRouter.delete('/:spaceId', userAuth, async (req: Request, res: Response) => {
  const { spaceId } = req.params;
  if (!req.userId) {
    res.status(401).json({ message: 'invalid request' })
    return
  } else {
    const userId = req.userId;
    try {
      const id = await spaceService.deleteSpace(userId, spaceId)
      res.status(200).json({ spaceId: id })
      return

    } catch (error) {
      res.status(400).json({ message: error })
      return
    }

  }
});

SpaceRouter.get('/all', userAuth , async (req: Request, res: Response) => {
  if (!req.userId) {
    res.status(401).json({ message: 'invalid request' })
    return
  } else {
    const userId = req.userId;
    try {
      const spaces = await spaceService.getAllSpaces()
      
      res.status(200).json({ 
        spaces: spaces.map(space => ({
          id: space.id,
          name: space.name, 
          thumbnail: space.thumbnail,
          dimensions: `${space.width}x${space.height}`,
          
        }))
      })
      return

    } catch (error) {
      res.status(400).json({ message: error })
      return
    }

  }
});

SpaceRouter.get('/:spaceId', userAuth, async (req: Request, res: Response) => {
  const { spaceId } = req.params
  if (!req.userId) {
    res.status(401).json({ message: 'invalid request' })
    return
  } else {
    const userId = req.userId;
    try {
      const space = await spaceService.getSpace(userId, spaceId)
      res.status(200).json({ space })
      return
    } catch (error) {
      if(error instanceof Error) res.status(400).json({ message: error.message })
      return
    }

  }
});

SpaceRouter.post('/element', async (req: Request, res: Response) => {
  const data = AddElementSchema.safeParse(req.body)
  if (!data.success) {
    res.status(400).json({ message: 'validation failed' })
    return
  }
  if (!req.userId) {
    res.status(401).json({ message: 'invalid request' })
    return
  } else {
    const userId = req.userId;
    if (data.data) {
      try {
        const id = await spaceService.addSpaceElement(userId, data.data)
        res.status(201).json({ id })
        return

      } catch (error) {
        res.status(400).json({ message: error })
        return
      }
    }
  }
});

SpaceRouter.delete('/element', async (req: Request, res: Response) => {
  const data = DeleteElementSchema.safeParse(req.body)
  if (!data.success) {
    res.status(400).json({ message: 'validation failed' })
    return
  }
  if (!req.userId) {
    res.status(401).json({ message: 'invalid request' })
    return
  } else {
    const userId = req.userId;
    if (data.data) {
      
      try {
        const id = await spaceService.deleteSpaceElement(userId, data.data.id)
        res.status(201).json({ id })
        return
      } catch (error) {
        res.status(400).json({ message: error })
        return
      }
    }
  }
});

SpaceRouter.get('/elements/all', userAuth, async  (req: Request, res: Response) => {
  
  if (!req.userId) {
    res.status(401).json({ message: 'invalid request' })
    return
  } else {
    const userId = req.userId;
    try {
      const spaceElements = await spaceService.getAllSpaceElements()
      res.status(200).json({ elements: spaceElements })
      return
    } catch (error) {
      if(error instanceof Error) res.status(400).json({ message: error.message })
      return
    }

  }
});
