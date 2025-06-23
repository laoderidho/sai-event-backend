import { Hono } from "hono";
import auth from "./auth/auth";
import admin from "./admin/admin";

const routes = new Hono();

routes.get('/', (c) => {
  return c.text('Hello Hono!')
})

routes.route('/auth', auth)
routes.route('/admin', admin)

export default routes