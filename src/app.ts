import * as express from 'express'
import * as mongoose from 'mongoose'

class App {
  public app: express.Application
  public port: number

  constructor(controllers, port) {
    this.app = express()
    this.port = port

    this.connectToDatabase()
    this.initializeMiddlewares()
    this.initializeControllers(controllers)
  }

  private initializeMiddlewares() {
    this.app.use(express.json())
    this.app.use((err, req, res, next) => {
      if (err) {
        res.send('Invalid Request data')
      } else {
        next()
      }
    })
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
