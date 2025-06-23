import { Context } from "hono";
import Iregion from "../../../interface/admin/region/region.interface";
import { HandleError } from "../../../utils/exception";
import RegionService from "../../../services/admin/region/region.service";


export default class RegionController {
    
    private regionService : RegionService;

    constructor() {
        this.regionService = new RegionService;
    }

    async add(c: Context){
        const body : Iregion = await c.req.json()

        try {
            const service = await this.regionService.Add(body, c)

            return c.json(service)
        } catch (error) {
            return HandleError(error, c)
        }
    }

    async get(c: Context){
        try {
            const region = await this.regionService.getall()

            return c.json(region)
        } catch (error) {
            return HandleError(error, c)
        }
    }

    async getDetail(c: Context){
        try {
            const id: number = Number(await c.req.param('id'));
            const data = await this.regionService.detail(id)

            return c.json(data)
        } catch (error) {
            return HandleError(error, c)
        }
    }

    async update(c: Context){
        try {
            const id: number = Number(c.req.param('id'))
            const body: Iregion = await c.req.json();
            const data = await this.regionService.update(body, id, c)

            return c.json(data)
        } catch (error) {
            return HandleError(error, c)
        }
    }

    async delete(c: Context){
        try {
            const id: number = Number(c.req.param('id'))
            const data = await this.regionService.delete(id, c)

            return c.json(data)
        } catch (error) {
            return HandleError(error, c)
        }
    }
}