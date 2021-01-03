import { Post } from '../Post';
import { Download } from './Download';

export class Dropbox extends Download {
  constructor(post: Post) {
    // this just triggers a download of the link so this one was the easiest one to implement
    const url = post.url.replace('dl=0', 'dl=1');
    super(url, post);
  }
}
