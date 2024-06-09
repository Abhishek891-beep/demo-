import {Hono} from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import {sign } from "hono/jwt"

export const userRouter = new Hono<
{
    Bindings : {
        DATABASE_URL : string ;
        JWT_SECRET : string ;
    }
}

>();


userRouter.post('/signup',async (c) => {
    const body = await c.req.json();
    const prisma = new PrismaClient({
      datasourceUrl : c.env.DATABASE_URL,
    }).$extends(withAccelerate())
  
    try {
      const user = await prisma.user.create({
        data :{
          username : body.username,
          password : body.password,
          name : body.name
        }
      })
      const jwt = await sign({
        id : user.id 
      } ,  c.env.JWT_SECRET);
      return c.text(jwt)
    } catch(e){
      c.status(411);
      return c.text("invalid")
    }
  })


userRouter.post('/api/v1/user/signin',async (c) => {
  
    
    const prisma = new PrismaClient({
      datasourceUrl : c.env.DATABASE_URL,
    }).$extends(withAccelerate());
  
    const body = await c.req.json();

    const user = await prisma.user.findFirst({
        where :{
          username : body.username ,
        }
      });


    if (!user){
        c.status(403);//unauthorised
        return c.text("user does not have an account , create new account")
      }
      
    const jwt = await sign({id : user.id } ,  c.env.JWT_SECRET );
    return c.text(jwt)
})


