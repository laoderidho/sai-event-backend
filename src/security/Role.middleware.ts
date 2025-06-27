import { Context } from "hono";
import { Next } from "hono";
import { decode } from "hono/jwt";
import { prisma } from "../utils/prisma";
import { getCookie } from "hono/cookie";

const RoleMiddleware = (params: number) =>{
    return async (c: Context, next: Next) => {
        // request token from header
       let token = getCookie(c, 'accessToken')

         if(!token){
            token = c.get('newAccessToken')
         }

            // cek token
            try {
                const {payload} = decode(token ?? '')
               
                if(!payload){
                    return c.json({
                        status: "error",
                        message: "Token tidak valid"
                    }, 401)
                }
                const {sub} = payload
                const id = Number(sub)
                const getRole = await prisma.user.findUnique({
                    where: {
                        id: id
                    },
                    select: {
                        roleId: true
                    }
                })

                if(getRole?.roleId !== params){
                    return c.json({
                        status: "error",
                        message: "Akses ditolak"
                    }, 403)
                }
               
               return await next()
            } catch (error: any) {
                return c.json({
                    status: "error",
                    message: error.message
                }, 401)   
            }
    }
}

export default RoleMiddleware