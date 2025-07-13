import { Context } from "hono";
import imageServices from "../../services/display/image.service";
import { HandleError } from "../../utils/exception";


class displayController {
    private imageServices: imageServices

    constructor(){
        this.imageServices = new imageServices()
    }

    async displayImage(c: Context){
        const {type, id} = c.req.param()
        try {
            const service = await this.imageServices.displayImage(type, Number(id))

            return new Response(service.image, {
                headers: {
                    'Content-Type': 'image/png',
                    'Content-Disposition': `inline; filename=profile${service.name}.png`
                }
            })
        } catch (error) {
            return  HandleError(error, c)
        }
    }
}

export default displayController