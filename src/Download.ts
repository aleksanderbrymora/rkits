import chalk from 'chalk';
import dl from 'download';
import { Post } from './Post';
import { logger } from './logger';

export class Download {
  constructor(private readonly dlurl: string, private readonly post: Post) {}

  async download(path: string = 'kits'): Promise<void> {
    try {
      logger(
        `Starting a download from ${this.post.onlineDrive} of`,
        this.post.title,
      );
      await dl(this.dlurl, path, {
        extract: true,
        // filename: this.post.title,
      });
      logger('Downloaded:', this.post.title);
    } catch (error) {
      // console.error(error);
      console.log(chalk.red(`${this.post.title} has failed to download`));
      console.log(
        chalk.white(
          `It failed with this url ${this.dlurl} from ${this.post.onlineDrive}`,
        ),
      );
    }
  }
}
