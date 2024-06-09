import {Hono} from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import {verify} from "hono/jwt"

export const blogRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string;
        JWT_SECRET: string;
    },
    Variables: {
        Id: String 
    }
}>();



blogRouter.use("/*",async (c , next)=> {
    // extract the user id 
    // pass it down to the route handler

    const authHeader = c.req.header('authorization') || "";
    const usper = await  verify(authHeader , c.env.JWT_SECRET);
    

    if(!usper){
        c.status(404);
        return c.json({error : "unauthorised"})
    }

    c.set("Id" , JSON.stringify(usper.id) )
    await next()
});


blogRouter.post('/',async (c) => {
    const body = await c.req.json();
    const authorId = c.get("Id");

    const prisma = new PrismaClient({
        datasourceUrl : c.env.DATABASE_URL,
      }).$extends(withAccelerate())

      try{
        const blog = await prisma.blog.create({
            data : {
                title : body.title,
                content : body.content,
                authorId : Number(authorId)
            }
        })
        
        return c.json({
            id : blog.id
        })
      } catch(e){
        console.log(e);
        return c.json({
            msg : "you have messed up somewhere"
        })
      }
  })
  
  blogRouter.put('/',async  (c) => {

    const body =await  c.req.json()
    const prisma = new PrismaClient({
        datasourceUrl : c.env.DATABASE_URL,
      }).$extends(withAccelerate())

    
    await prisma.blog.update({
        where : {
            id : body.id 
        },
        data : {
            title : body.title,
            content : body.content 
        }
    })
    
    return c.text("upploaded post")

  })
  
  blogRouter.get("/",async (c)=> {

    const body = await c.req.json();

    const prisma = new PrismaClient({
        datasourceUrl : c.env.DATABASE_URL,
      }).$extends(withAccelerate())

    try {
        const blogs = prisma.blog.findFirst({
            where : {
                id : body.id
            }
        })
        return c.json(blogs)

    }catch(e){
        c.status(411);
        return c.json({
            message : "error while fetching blog post"
        })
    }
  })
  
//   pagination
  blogRouter.get("/bulk",async (c)=> {
    const prisma = new PrismaClient({
        datasourceUrl : c.env.DATABASE_URL,
      }).$extends(withAccelerate())

    
    const blogs = await prisma.blog.findMany()

    return c.json({
        blogs
    })

  })


