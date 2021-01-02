import { Post } from './Post';
import { Download } from './Download';

export class Google extends Download {
  constructor(post: Post) {
    // todo change that string to the actual url
    super('', post);
  }
}
