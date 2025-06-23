import { Context } from "hono";
import AuthServices from "../../services/auth/auth.service";
import { IRegister, Vregister } from "../../interface/auth/register.interface";
import { HandleError } from "../../utils/exception";

class authController {
    private authService: AuthServices

    constructor(){
        this.authService = new AuthServices()
    }

    async register(c: Context){
        const body: IRegister = await c.req.json()

        try {
            const validateData = Vregister.parse(body)

            const service = await this.authService.register(validateData)

            return c.json({ data: service }, 201);

        } catch (error) {
            return HandleError(error, c)
        }
    }

    async login(c: Context){
        try {
            const body = await c.req.json()

            const service = await this.authService.login(body, c)

            return c.json({ data: service }, 200);

        } catch (error) {
            return HandleError(error, c)
        }
    }

}

export default authController