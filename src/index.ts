import { Hono } from 'hono'
import { cors } from 'hono/cors'
import routes from './router/routes'
import { corsEnable } from './config/general.config'

const app = new Hono()

app.use("/api/*", cors({
  origin: corsEnable,
  credentials: true
}))

app.route('/api', routes)

export default app
