import { Router, Request, Response, NextFunction } from 'express'
import Controller from '../interfaces/controller.interface'
import PostInterface from './post.interface'
import postModel from './posts.model'
import * as mongoose from 'mongoose'
import validationMiddleware from '../middleware/validation.middleware'
import CreatePostDto from './post.dto'

import PostNotFoundException from '../exceptions/PostNotFoundException'

class PostsController {
  public path = '/posts'
  public router = Router()
  private post = postModel

  constructor() {
    this.initializeRoutes()
  }

  private createPost = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const postData: PostInterface = request.body
    const newPost = await this.post.create(postData).catch(err => {
      next(err)
    })
    response.status(201).send(newPost)
  }

  private getPostById = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const { id } = request.params
    if (mongoose.Types.ObjectId.isValid(id)) {
      try {
        const foundPost = await this.post.findById(id)
        foundPost
          ? response.send(foundPost)
          : next(new PostNotFoundException(id))
      } catch (err) {
        next(err)
      }
    } else {
      response.status(400).send('invalid id')
    }
  }
  private getAllPosts = async (request: Request, response: Response) => {
    const posts = await this.post.find().catch(err => {
      throw new Error(err)
    })
    response.send(posts)
  }

  private updatePost = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const { id } = request.params
    if (mongoose.Types.ObjectId.isValid(id)) {
      try {
        const postData: PostInterface = request.body
        if (!postData) {
          response.status(400).send('BAD REQUEST')
        }
        const updatedPost = await this.post.findByIdAndUpdate(
          { _id: id },
          postData,
          { new: true }
        )
        updatedPost
          ? response.send(updatedPost)
          : next(new PostNotFoundException(id))
      } catch (err) {
        next(err)
      }
    } else {
      response.status(400).send('invalid id')
    }
  }

  private deletePost = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const { id } = request.params
    if (mongoose.Types.ObjectId.isValid(id)) {
      try {
        const deletedPost = await this.post.findByIdAndDelete(id)
        deletedPost
          ? response.send(deletedPost)
          : next(new PostNotFoundException(id))
      } catch (error) {
        next(error)
      }
    } else {
      response.status(400).send('invalid id')
    }
  }

  public initializeRoutes() {
    this.router.post(
      this.path,
      validationMiddleware(CreatePostDto),
      this.createPost
    )
    this.router.get(this.path, this.getAllPosts)
    this.router.get(`${this.path}/:id`, this.getPostById)
    this.router.patch(
      `${this.path}/:id`,
      validationMiddleware(CreatePostDto, true),
      this.updatePost
    )
    this.router.delete(`${this.path}/:id`, this.deletePost)
  }
}

export default PostsController
