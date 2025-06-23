import Iregion from "../../../interface/admin/region/region.interface";
import { HTTPException } from "hono/http-exception";
import { prisma } from "../../../utils/prisma";


export default class RegionService {

    async Add(body: Iregion){
        try {
            const {name} = body

            await prisma.region.create({
                data: {
                    name: name
                }
            })

            return {
                message: "Berhasil di tambahkan"
            }
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

    
    async update(body: Iregion, id: number){
        try {

            const {name} = body
            
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

            await prisma.region.update({
                where: {
                    id: data?.id
                }, 
                data: {
                    name: name
                }
            })

            return {
                message: "berhasil di update"
            }

        } catch (error) {
            throw error
        }
    }

    async delete(id: number){
        try {
            
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

            await prisma.region.delete({
                where: {
                    id: id
                }
            })

            return {
                message: "berhasil di hapus"
            }

        } catch (error) {
            throw error
        }
    }
}