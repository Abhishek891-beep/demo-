import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import {sign } from "hono/jwt"
import { userRouter } from './routes/user'
import { blogRouter } from './routes/blog'


const app = new Hono<{
  Bindings : {
    DATABASE_URL  : string ;
    JWT_SECRET :string;
  }
}>()

app.route("/api/v1/user" , userRouter);
app.route("/api/v1/blog",blogRouter);


// app.post('/api/v1/user/signup',async (c) => {
//   const body = await c.req.json();
//   const prisma = new PrismaClient({
//     datasourceUrl : c.env.DATABASE_URL,
//   }).$extends(withAccelerate())

//   try {
//     const user = await prisma.user.create({
//       data :{
//         username : body.username,
//         password : body.password,
//         name : body.name
//       }
//     })
//     const jwt = await sign({
//       id : user.id 
//     } ,  c.env.JWT_SECRET);
//     return c.text(jwt)
//   } catch(e){
//     c.status(411);
//     return c.text("invalid")
//   }
// })


// app.post('/api/v1/user/signin',async (c) => {
//   const body = await c.req.json();
//   const prisma = new PrismaClient({
//     datasourceUrl : c.env.DATABASE_URL,
//   }).$extends(withAccelerate())

//   try {
//     const user = await prisma.user.findFirst({
//       where :{
//         username : body.username,
//         password : body.password,
//       }
//     })
//     if (!user){
//       c.status(403);//unauthorised
//       return c.text("user does not have an account , create new account")
//     }

//     const jwt = await sign({
//       id : user.id 
//     } ,  c.env.JWT_SECRET );
//     return c.text(jwt)

//   } catch(e){
//     c.status(411);
//     return c.text("invalid")
//   }
// })





export default app


// postgresql://test_owner:vIW4gV1yLAqd@ep-morning-dawn-a590h44w.us-east-2.aws.neon.tech/test?sslmode=require"








// DATABASE_URL="prisma://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlfa2V5IjoiZjJlMWEyNTYtNDM0My00NzcyLTk3NTktMjE5NzZlYWNlZGNmIiwidGVuYW50X2lkIjoiYzI4OGVjZTNhN2JhMWJhYTkzYTY4ZTc4NTJjNzAwYWQ4M2VkNTdiNmVkYjY2NDY2ODViODNlODY3NmNlOGZmOCIsImludGVybmFsX3NlY3JldCI6ImQwZWE1YzU4LWIwNzgtNDgzZC1hZTNhLTc3OTAzZjIyMjI5ZSJ9.H_JEzu3WFVSjCjWs2gZvhSNwaEhmYFnz2Jn0Y-BqlH0"