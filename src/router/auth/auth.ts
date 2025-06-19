import { Hono } from "hono";
import authController from "../../controller/auth/auth.controller";

const auth = new Hono();

const AuthController = new authController

auth.post("/login", (c) => AuthController.login(c)); 
auth.post("/register", (c) => AuthController.register(c)); 

export default auth