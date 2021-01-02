import { Post } from '../Post';
import { download as dl } from 'wetransfert';
import path from 'path';
import { logger } from '../logger';
import chalk from 'chalk';

export class Wetransfer {
  constructor(private readonly post: Post) {}

  async download() {
    logger(
      `Starting a download from ${this.post.onlineDrive} (url: ${this.post.url}) of`,
      this.post.title,
    );
    try {
      const pth = path.resolve(__dirname, 'kits');

      await dl(this.post.url, pth);
      logger('Downloaded:', this.post.title);
    } catch (error) {
      console.log(chalk.red(`${this.post.title} has failed to download`));
      console.log(
        chalk.white(
          `It failed with this url ${this.post.url} from ${this.post.onlineDrive}`,
        ),
      );
    }
  }
}
