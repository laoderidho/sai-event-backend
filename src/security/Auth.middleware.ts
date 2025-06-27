import { Context, Next } from "hono";
import { verify } from "hono/jwt";
import { secretAccessToken } from "../config/jwtSecret.config";
import { prisma } from "../utils/prisma";
import { getCookie } from "hono/cookie";
import { setAccessToken } from "../utils/general";
import { IaccessToken } from "../interface/utils/accessToken.interface";


const authMiddleware = async (c: Context, next: Next) => {
    try {
      let token = getCookie(c, 'accessToken')
      const refreshToken = getCookie(c, 'refreshToken')
      let data

      
      try {
        data = await verify(token ?? '', secretAccessToken ?? '')
      } catch (err) {

        const refreshStatus: IaccessToken = await setAccessToken(c, refreshToken ?? '')
        if (refreshStatus.status !== 1) {
          return c.json({
            status: "error",
            message: "anda tidak dikenali"
          }, 401)
        }

        token = refreshStatus.token
       
        try {
          data = await verify(token ?? '', secretAccessToken ?? '')
        } catch {
          return c.json({
            status: "error",
            message: "Token baru tidak valid"
          }, 401)
        }
      }
  
      const { sub } = data as { sub?: string }
  
      if (!sub || isNaN(Number(sub))) {
        return c.json({
          status: "error",
          message: "Token tidak valid"
        }, 401)
      }
  
      const user = await prisma.user.findUnique({
        where: { id: Number(sub) }
      })
  
      if (!user) {
        return c.json({
          status: "error",
          message: "User Tidak Ditemukan"
        }, 404)
      }

      c.set("newAccessToken", token)
      return await next()
    } catch (error) {
      return c.json({
        status: "error",
        message: "Token tidak valid"
      }, 401)
    }
}
  

export default authMiddleware