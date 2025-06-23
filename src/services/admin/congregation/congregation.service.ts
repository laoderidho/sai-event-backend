import Icongregation from "../../../interface/admin/congregation/congregation.interface";
import { HTTPException } from "hono/http-exception";
import { prisma } from "../../../utils/prisma";
import { Context } from "hono";
import { verify } from "hono/jwt";
import { secretAccessToken } from "../../../config/jwtSecret.config";
import { statusLogcreateId, statusLogdeleteId, statusLogupdateId } from "../../../config/general.config";
import { getDatCongregation } from "../../../query/Admin/Conggregation/conggregation.query";


export default class ConggregationService {

    async add(body: Icongregation, c: Context){

        try {
            
            const {region_id, name}= body

            // token
            const token = await c.req.header('Authorization')
            const dataToken = await verify(token ?? '', secretAccessToken ?? '')
            const {email} = dataToken

            const getRegion = await prisma.region.findUnique({
                where: {
                    id: region_id
                }
            })

            if(!getRegion){
                throw new HTTPException(404, {message: "Wilayah tidak ditemukan"})
            }

            const dbTrans = await prisma.$transaction(async prisma =>{
                const data = await prisma.congregation.create({
                    data: {
                        name: name,
                        region_id: region_id
                    }
                })

                await prisma.lg_congregation.create({
                    data: {
                        name: name,
                        region_id: data.region_id,
                        conggregation_id: data.id,
                        input_at: String(email),
                        action_id: statusLogcreateId,
                        createdAt: new Date
                    }
                })

                return {
                    message: "Jemaat Berhasil di tambahkan"
                }
            })

            return dbTrans

        } catch (error) {
            throw error
        }
    }

    async getAll() {
        try {
            const data = await prisma.$queryRawUnsafe(getDatCongregation())

            return {
                data
            }
        } catch (error) {
            throw error
        }
    }

    async getByRegion(id: number){

        try {
            
            const data = await prisma.congregation.findMany({
                where: {
                    region_id: id
                }, 
                select: {
                    id: true,
                    name: true
                }
            })

            return {
                data
            }
            
        } catch (error) {
            throw error
        }

    }

    async getDetail(id: number){
        try {
            
            const data = await prisma.congregation.findUnique({
                where: {
                    id: id
                }, 
                select: {
                    id: true,
                    name: true
                }
            })

            if(!data){
                throw new HTTPException(404, {message: 'Jemaat tidak ditemukan'})
            }

            return {
                data
            }
            
        } catch (error) {
            throw error
        }
    }

    async update(id: number, c: Context, body: Icongregation){

        try {
            // token
            const token = c.req.header('Authorization')
            const dataToken = await verify(token ?? '', secretAccessToken ?? '')
            const {email} = dataToken

            // body
            const {name, region_id} = body

            
            const getCongregation = await prisma.congregation.findFirst({
                where: {
                    id: id,
                    region_id: region_id
                }
            })

            if(!getCongregation){
                throw new HTTPException(404, {message: "Wilayah tidak ditemukan"})
            }

            const dbTrans = await prisma.$transaction(async prisma => {
                const data = await prisma.congregation.update({
                    where: {
                        id: id
                    },
                    data: {
                        name: name,
                        region_id: region_id
                    }
                })

                await prisma.lg_congregation.create({
                    data: {
                        name: name,
                        region_id: data.region_id,
                        conggregation_id: data.id,
                        input_at: String(email),
                        action_id: statusLogupdateId,
                        createdAt: new Date
                    }
                })

                return {
                    message: "Jemaat Berhasil di Update"
                }
            })

            return dbTrans

        } catch (error) {
            throw error
        }
    }

    async delete(id: number, c: Context){
        try {
             // token
            const token = c.req.header('Authorization')
            const dataToken = await verify(token ?? '', secretAccessToken ?? '')
            const {email} = dataToken

            const data = await prisma.congregation.findUnique({
                where: {
                    id: id
                }
            })

            if(!data){
                throw new HTTPException(404, {message: 'Jemaat tidak ditemukan'})
            }

            const dbTrans = await prisma.$transaction(async prisma=>{
                await prisma.congregation.delete({
                    where: {
                        id: id
                    }
                })

                await prisma.lg_congregation.create({
                    data: {
                        name: data.name,
                        action_id: statusLogdeleteId,
                        input_at: String(email),
                        region_id: data.region_id,
                        conggregation_id: data.id
                    }
                })

                return {
                    message: "Jemaat Berhasil dihapus"
                }
            })

            return dbTrans
        } catch (error) {
            throw error
        }
    }
}