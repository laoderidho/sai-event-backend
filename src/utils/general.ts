import { Context } from "hono"
import { setCookie } from "hono/cookie"
import { sign, verify } from "hono/jwt"
import { secretAccessToken, secretRefreshToken } from "../config/jwtSecret.config"
import { prisma } from "./prisma"
import { IaccessToken } from "../interface/utils/accessToken.interface"

export const getUserNameType = (username: string): "no_telp" | "email" => {
     if (!isNaN(Number(username))){
            return "no_telp"
        }else{
            return "email"
        }
}

export const setAccessToken = async (c: Context, token: string): Promise<IaccessToken> => {

    const data = await verify(token, secretRefreshToken ?? '')

    if(!data){
        return {
            status: 0
        }
    }

    const { sub } = data 
    const id = Number(sub)

    const user = await prisma.user.findUnique({
        where: {
            id: id
        }
    })

    if(!user){
        return {
            status: 0
        }
    }

    const payload = {
        sub: user.id,
        role: data.roleId,
        email: data.email,
        exp: Math.floor(Date.now() / 1000) + 60 * 180
    }

    const getToken = await sign(payload, secretAccessToken ?? '')

    setCookie(c, 'accessToken', getToken, {
        maxAge: 60 * 60 * 3,
        httpOnly: true,
        sameSite: 'Strict'
    })

    return {
        status: 1,
        token: getToken
    };
}