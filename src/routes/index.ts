import { Express } from 'express'
import routes_v1 from './v1'
import routes_v2 from './v2'

const PREFIX = '/api'

const routes = (app: Express) => {
  app.use(`${PREFIX}/v1`, routes_v1)
  app.use(`${PREFIX}/v2`, routes_v2)
}

export default routes
