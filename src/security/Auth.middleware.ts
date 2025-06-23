import { Context, Next } from "hono";
import { verify } from "hono/jwt";
import { secretAccessToken } from "../config/jwtSecret.config";
import { prisma } from "../utils/prisma";


const authMiddleware = async (c: Context, next: Next) =>{
    const token = c.req.header('Authorization')

    if(!token){
        return c.json({
            status: "error",
            message: "anda tidak dikenali"
        }, 401)
    }

    try {
        const data = await verify(token, secretAccessToken ?? '')
        
        if(!data){
            return c.json({
                status: "error",
                message: "Token tidak valid"
            }, 401)
        }

        const {sub} = data

        const id = Number(sub)
        const getdata = await prisma.user.findUnique({
            where: {
                id: id
            }
        })

        if(!getdata){
            return c.json({
                status: "error",
                message: "User Tidak Ditemukan"
            }, 404)
        }

        return await next()
    } catch (error) {
        return c.json({
            status: "error",
            message: "Token tidak valid"
        }, 401)
    }
}

export default authMiddleware