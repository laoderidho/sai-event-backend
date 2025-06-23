import { Hono } from "hono";
import region from "./region/region";
import authMiddleware from "../../security/Auth.middleware";
import RoleMiddleware from "../../security/Role.middleware";
import { adminId } from "../../config/general.config";
import congregation from "./congregation/congregation";


const admin = new Hono()

admin.use(authMiddleware)
admin.use(RoleMiddleware(adminId))

admin.route("/region", region)
admin.route("/congregation", congregation)


export default admin