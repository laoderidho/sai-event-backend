import { Context } from "hono";
import ConggregationService from "../../../services/admin/congregation/congregation.service";
import Icongregation from "../../../interface/admin/congregation/congregation.interface";
import { HandleError } from "../../../utils/exception";


export default class CongregationController {
    
    private congregationService : ConggregationService

    constructor(){
        this.congregationService = new ConggregationService
    }

    async add(c: Context){
        const body: Icongregation = await c.req.json()

        try {
           const service = await this.congregationService.add(body, c)

           return c.json(service)
            
        } catch (error) {
            return HandleError(error, c)
        }
    }

    async getAll(c: Context){
        try {
            const service = await this.congregationService.getAll()

            return c.json(service)
        } catch (error) {
          return  HandleError(error, c)
        }
    }

    async getByRegion(c: Context){
        const {region_id} = c.req.param()

        try {
            const service = await this.congregationService.getByRegion(Number(region_id))

            return c.json(service)
        } catch (error) {
          return  HandleError(error, c)
        }
    }

    
    async getDetail(c: Context){
        const {id} = c.req.param()

        try {
            const service = await this.congregationService.getDetail(Number(id))
            return c.json(service)
        } catch (error) {
           return HandleError(error, c)
        }
    }

    async update(c: Context){
        const {id} = c.req.param()
        const body: Icongregation = await c.req.json();
        try {
            const service = await this.congregationService.update(Number(id), c, body)
            return c.json(service)
        } catch (error) {
            return HandleError(error, c)
        }
    }

    async delete(c: Context){
        const {id} = c.req.param()

        try {
            const service = await this.congregationService.delete(Number(id), c)
            return c.json(service)
        } catch (error) {
            return HandleError(error, c)
        }
    }
}