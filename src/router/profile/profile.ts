import { Hono } from "hono";
import profileController from "../../controller/profile/profile.controller";

const profile = new Hono()

const Cprofile = new profileController()

profile.post('/add-image', c => Cprofile.addImageProfile(c))

export default profile