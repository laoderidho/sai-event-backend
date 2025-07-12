import Iregion from "../../../interface/admin/region/region.interface";
import { HTTPException } from "hono/http-exception";
import { prisma } from "../../../utils/prisma";
import { Context } from "hono";
import { verify } from "hono/jwt";
import { secretAccessToken } from "../../../config/jwtSecret.config";
import { statusLogcreateId, statusLogdeleteId, statusLogupdateId } from "../../../config/general.config";
import { getCookie } from "hono/cookie";

export default class RegionService {

    async Add(body: Iregion, c: Context){
        try {
            const {name} = body
            let token = getCookie(c, 'accessToken')

            if(!token){
                token = c.get('newAccessToken')
             }

            const dataToken = await verify(token ?? '', secretAccessToken ?? '')

            const {email} = dataToken

            const dbTrans = await prisma.$transaction(async prisma=>{
                const data = await prisma.region.create({
                    data: {
                        name: name
                    }
                })
    
                await prisma.lg_region.create({
                    data: {
                        name: name,
                        action_id: statusLogcreateId,
                        input_at: String(email),
                        region_id: data.id
                    }
                })
    
                return {
                    message: "Berhasil di tambahkan"
                }
            })

            return ''
            
        } catch (error) {
            throw error
        }
    }

    async getall(){
        try {
           const data = await prisma.region.findMany({
                select: {
                    id: true,
                    name: true
                }
            })

            return {
                data: data
            }
        } catch (error) {
            throw error
        }
    }

    async detail(id: number){
        try {
            const data = await prisma.region.findUnique({
                where: {
                    id: id
                }
            })

            if(!data){
                throw new HTTPException(404, {message: 'wilayah tidak ditemukan'})
            }

            return {
                data
            }
        } catch (error) {
            throw error
        }
    }

    
    async update(body: Iregion, id: number, c: Context){
        try {

            const {name} = body
            let token = getCookie(c, 'accessToken')

            if(!token){
                token = c.get('newAccessToken')
             }
            const dataToken = await verify(token ?? '', secretAccessToken ?? '')
            const {email} = dataToken
            
            const data = await prisma.region.findUnique({
                where: {
                    id: id
                },
                select: {
                    id: true
                }
            })

            if(!data){
                throw new HTTPException(404, {message: 'wilayah tidak ditemukan'})
            }

            const dbTrans = await prisma.$transaction(async prisma=>{
                const dataUpdate =  await prisma.region.update({
                    where: {
                        id: data?.id
                    }, 
                    data: {
                        name: name
                    }
                })

                await prisma.lg_region.create({
                    data: {
                        name: dataUpdate.name,
                        action_id: statusLogupdateId, // or another appropriate value
                        input_at: String(email),
                        region_id: data.id
                    }
                })

                return {
                    message: "berhasil di update"
                }
            })

            return dbTrans

        } catch (error) {
            throw error
        }
    }

    async delete(id: number, c: Context){
        try {
            let token = getCookie(c, 'accessToken')

            if(!token){
                token = c.get('newAccessToken')
             }
             
            const dataToken = await verify(token ?? '', secretAccessToken ?? '')
            const {email} = dataToken

            const data = await prisma.region.findUnique({
                where: {
                    id: id
                }
            })

            if(!data){
                throw new HTTPException(404, {message: 'wilayah tidak ditemukan'})
            }

            const dataCongregation = await prisma.congregation.findMany({
                where: {
                    region_id: id
                }
            })

            if(dataCongregation.length > 0){
                throw new HTTPException(409, {message: 'Region sudah mempunyai beberapa Jemaat, hapus jemaat terlebih dahulu untuk mengapus region ini'})
            }


            const dbTrans = await prisma.$transaction(async prisma => {
                await prisma.region.delete({
                    where: {
                        id: id
                    }
                })

                await prisma.lg_region.create({
                    data: {
                        name: data.name,
                        action_id: statusLogdeleteId, // or another appropriate value
                        input_at: String(email),
                        region_id: data.id
                    }
                })

                return {
                    message: "berhasil di hapus"
                }
            })

            
            return dbTrans
        } catch (error) {
            throw error
        }
    }
}