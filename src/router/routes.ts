import { Hono } from "hono";
import auth from "./auth/auth";
import admin from "./admin/admin";
import data from "./data/data";

const routes = new Hono();

routes.get('/', (c) => {
  return c.text('Hello Hono!')
})

routes.route('/auth', auth)
routes.route('/admin', admin)
routes.route('/data', data)
export default routes