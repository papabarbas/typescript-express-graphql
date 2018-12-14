import { Router, Request, Response } from 'express'
import Controller from '../interfaces/controller.interface'
import PostInterface from './post.interface'
import postModel from './posts.model'
import * as mongoose from 'mongoose'

class PostsController {
  public path = '/posts'
  public router = Router()
  private post = postModel

  constructor() {
    this.initializeRoutes()
  }

  private createPost = async (request: Request, response: Response) => {
    const postData: PostInterface = request.body
    const newPost = await this.post.create(postData).catch(err => {
      throw new Error(err)
    })
    response.send(newPost)
  }

  private getPostById = async (request: Request, response: Response) => {
    const { id } = request.params
    if (mongoose.Types.ObjectId.isValid(id)) {
      try {
        const foundPost = await this.post.findById(id)
        foundPost
          ? response.send(foundPost)
          : response.status(404).send('post not found')
      } catch (err) {
        throw new Error(err)
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

  private updatePost = async (request: Request, response: Response) => {
    const { id } = request.params
    if (mongoose.Types.ObjectId.isValid(id)) {
      try {
        const postData: PostInterface = request.body
        if (!postData) {
          response.status(400).send('BAD REUEST')
        }
        const updatedPost = await this.post.findByIdAndUpdate(
          { _id: id },
          postData,
          { new: true }
        )
        updatedPost
          ? response.send(updatedPost)
          : response.status(404).send('post not found')
      } catch (err) {
        throw new Error(err)
      }
    } else {
      response.status(400).send('invalid id')
    }
  }

  private deletePost = async (request: Request, response: Response) => {
    const deletedPost = await this.post
      .findByIdAndDelete(request.params.id)
      .catch(err => {
        throw new Error(err)
      })
    response.send(deletedPost)
  }

  public initializeRoutes() {
    this.router.post(this.path, this.createPost)
    this.router.get(this.path, this.getAllPosts)
    this.router.get(`${this.path}/:id`, this.getPostById)
    this.router.patch(`${this.path}/:id`, this.updatePost)
    this.router.delete(`${this.path}/:id`, this.deletePost)
  }
}

export default PostsController
