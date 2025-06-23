import { Hono } from "hono";
import region from "./region/region";
import authMiddleware from "../../security/Auth.middleware";
import RoleMiddleware from "../../security/Role.middleware";
import { adminId, userId } from "../../config/general.config";


const admin = new Hono()

admin.use(authMiddleware)
admin.use(RoleMiddleware(adminId))

admin.route("/region", region)


export default admin