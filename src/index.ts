import { Hono } from 'hono'
import { cors } from 'hono/cors'
import routes from './router/routes'

const app = new Hono()

app.use("/api/*", cors({
  origin: process.env.CORS_URL,
  credentials: true
}))

app.route('/api', routes)

export default app
