import { Post } from '../Post';
import { download as dl } from 'wetransfert';
import path from 'path';
import { logger } from '../logger';
import chalk from 'chalk';
import unzip from 'extract-zip';
import del from 'del';

export class Wetransfer {
  constructor(private readonly post: Post) {}

  async download() {
    logger(
      `Starting a download from ${this.post.onlineDrive} of`,
      this.post.title,
    );
    try {
      const pth = path.resolve('kits');
      const { content } = await dl(this.post.url, pth);
      await Promise.all(
        content.items.map(async (i) => {
          const file = path.resolve('kits', i.name);
          await unzip(file, { dir: pth });
          return del(file);
        }),
      );
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
