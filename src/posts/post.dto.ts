import { IsString } from 'class-validator'

export default class CreatePostsDto {
  @IsString()
  public author: String
  @IsString()
  public content: String
  @IsString()
  public title: String
}
