import { Post } from 'Post';
import download from 'download';
import chalk from 'chalk';

export class Dropbox {
  public readonly dlurl: string;
  private post: Post;
  constructor(post: Post) {
    this.dlurl = post.url.replace('dl=0', 'dl=1');
    this.post = post;
  }
  async download(path: string = 'kits'): Promise<void> {
    try {
      await download(this.dlurl, path);
    } catch (error) {
      console.error(error);
      console.log(chalk.red(`${this.post.title} has failed to download`));
    }
  }
}

// const dropbox = async (browser: pptr.Browser, post: Post): Promise<void> => {
//   const page = await browser.newPage();
//   await page.goto(post.url);
//   const buttonSelector = 'button[aria-label="Download"]';
//   await page.waitForSelector(buttonSelector);
//   await page.click(buttonSelector);
//   page.on('response', async (res: any) => {
//     const resType = res._headers['content-disposition'] as string;
//     console.log(resType);
//     if (!resType.includes('filename')) return;
//     const filename = resType
//       .split('; ')[1]
//       .replace(/"/g, '')
//       .replace('filename=', '');
//     const filePath = path.resolve('../../Downloads', 'filename');
//     const fileSize = parseInt(res._headers['content-length']);
//     const waitForFile = () =>
//       new Promise((resolve, rej) => {
//         logger('starting to watch file');
//         fs.watchFile(filePath, { interval: 100, persistent: true }, (curr) => {
//           console.log(JSON.stringify(curr));
//           console.log({ fileSize, currentSize: curr.size, filePath });
//           if (fileSize === curr.size) {
//             logger('filesizes match');
//             return resolve('File downloaded');
//           }
//         });
//       });
//     await waitForFile();
//     await page.close();
//   });
// };
