import { Hono } from "hono";
import profileController from "../../controller/profile/profile.controller";
import authMiddleware from "../../security/Auth.middleware";

const profile = new Hono()

const Cprofile = new profileController()


profile.use(authMiddleware)
profile.post('/add-image', c => Cprofile.addImageProfile(c))
profile.get('/:id', c => Cprofile.getDataProfile(c))

export default profile