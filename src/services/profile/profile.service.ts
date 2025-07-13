import { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import { getCookie } from "hono/cookie";
import { verify } from "hono/jwt";
import { secretAccessToken } from "../../config/jwtSecret.config";
import { prisma } from "../../utils/prisma";
import { getDataProfile } from "../../query/Profile/profile.query";
import { hostLink } from "../../../test/config";


class ProfileServices {

    async addImageProfile(c: Context){
        try {
            const body = await c.req.json()

            // token
            let token = getCookie(c, 'accessToken')
            
            if(!token){
                token = c.get('newAccessToken')
            }
            const dataToken = await verify(token ?? '', secretAccessToken ?? '')
            const {sub} = dataToken
            
            // image request
            const {image} = body

            if(!image){
                throw new HTTPException(400, {message: "upload Gambar Lebih dulu"})
            }

            // conver image to buffer
            const conImage = Buffer.from(image, 'base64')

            const maxSize = 5 * 1024 * 1024
            if (conImage.length > maxSize) {
                throw new HTTPException(400, {message: "Ukuran Gambar Terlalu Besar"})
            }

            const user = await prisma.user.findUnique({
                where: {
                    id: Number(sub)
                }
            })

            if(!user){
                throw new HTTPException(404, {message: "User Tidak Ditemukan"})
            }

            await prisma.user.update({
                where: {
                    id: user.id
                }, 
                data: {
                    profile_image: conImage
                }
            })

            return {message: "Profile Berhasil di Update"}
        } catch (error) {
             throw error
        }
    }

    async getProfile(c: Context){
        const {id} = c.req.param()

        try {
            
            const data = await prisma.$queryRawUnsafe(getDataProfile(Number(id), hostLink))
            
            if(!data){
                throw new HTTPException(404, {message: "Profile Tidak Ada"})
            }
            
            return {
                data
            }
        } catch (error) {
            throw error
        }
        
    }
}

export default ProfileServices