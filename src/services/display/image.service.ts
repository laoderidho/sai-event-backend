import { HTTPException } from "hono/http-exception";
import { prisma } from "../../utils/prisma";


class imageServices {
    async displayImage(type: string, id: number){
        try {
            const user = await prisma.user.findUnique({
                where: {
                    id
                }, 
                select: {
                    profile_image: true,
                    name: true
                }
            })

            if(!user || user.profile_image == null){
                throw new HTTPException(404, {message: "gambar tidak ditemukan"})
            }

            const image = Buffer.from(user.profile_image)
           
            return {
                image: image,
                name: user.name
            }
        } catch (error) {
              throw error
        }
    }
}

export default imageServices