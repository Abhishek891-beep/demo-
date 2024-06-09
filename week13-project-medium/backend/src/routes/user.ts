import {Hono} from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import {sign } from "hono/jwt"
import {signupInput , signinInput} from "@abhishekkalagurki/medium-common4";

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

    const {success}  = signupInput.safeParse(body);
    if (!success){
      c.status(403);
      return c.json({
        msg : "inputs are not valid"
      })
    }
  
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




userRouter.post('/signin',async (c) => {
    const body = await c.req.json();
    const {success} = signinInput.safeParse(body);
    if(!success){
      c.status(411);
      return c.json({
        message : "inputs not correct"
      })
    }


    const prisma = new PrismaClient({
      datasourceUrl : c.env.DATABASE_URL ,
    }).$extends(withAccelerate());
  

    try{
      const user = await prisma.user.findFirst({
        where :{
          username : body.username ,
          password : body.password
        }
      });

      const jwt = await sign({id : user?.id } ,  c.env.JWT_SECRET );
      return c.text(jwt)

    } catch(e){
      c.status(403);//unauthorised
      return c.text("user does not have an account , create new account")

    }
    
  




    // if (!user){
    //     c.status(403);//unauthorised
    //     return c.text("user does not have an account , create new account")
    //   }


})





