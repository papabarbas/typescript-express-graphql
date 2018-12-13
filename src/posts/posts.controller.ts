import * as express from 'express';
import Post from './posts.interface';

class PostsController {
  constructor() {
    this.initializeRoutes();
  }

  public path = '/posts';
  public router = express.Router();
  public initializeRoutes() {
    this.router.get(this.path, this.getAllPosts);
    this.router.post(this.path, this.createPost);
  }
  private posts: Post[] = [
    {
      author: 'Marcin',
      content: 'Dolor sit amet',
      title: 'Lorem Ipsum'
    }
  ];

  getAllPosts = (req: express.Request, res: express.Response) => {
    res.send(this.posts);
  };
  createPost = (req: express.Request, res: express.Response) => {
    const post: Post = req.body;
    this.posts.push(post);
    res.send(post);
  };
}

export default PostsController;
