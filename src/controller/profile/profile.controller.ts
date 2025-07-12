import { Context } from "hono";
import ProfileServices from "../../services/profile/profile.service";
import { HandleError } from "../../utils/exception";

class profileController {
    private profileService: ProfileServices

    constructor(){
        this.profileService = new ProfileServices()
    }

    addImageProfile = async (c: Context) => {
        try {
            const service = await this.profileService.addImageProfile(c)
            return c.json(service)
        } catch (error) {
            return HandleError(error, c)
        }
    }
}

export default profileController