import * as express from 'express'
import * as mongoose from 'mongoose'
import Controller from './interfaces/controller.interface'
import errorMiddleware from './middleware/error.middleware'

class App {
  public app: express.Application
  public port: number

  constructor(controllers, port) {
    this.app = express()
    this.port = port

    this.connectToDatabase()
    this.initializeMiddlewares()
    this.initializeControllers(controllers)
    this.initializeErrorHandling()
  }

  private initializeMiddlewares() {
    this.app.use(express.json())
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware)
  }

  private initializeControllers(controllers) {
    controllers.forEach(controller => {
      this.app.use('/', controller.router)
    })
  }

  private connectToDatabase() {
    const {
      MONGODB_USER,
      MONGODB_PASSWORD,
      MONGODB_HOST,
      MONGODB_DATABASE
    } = process.env

    mongoose
      .connect(
        `mongodb+srv://${MONGODB_HOST}`,
        {
          user: MONGODB_USER,
          pass: MONGODB_PASSWORD,
          dbName: MONGODB_DATABASE,
          useNewUrlParser: true
        }
      )
      .then(() => console.log('connected to mongodb'))
      .catch(err => console.log(err))
  }
  public listen() {
    this.app.listen(this.port, () =>
      console.log(`App listening on port ${this.port}`)
    )
  }
}

export default App
