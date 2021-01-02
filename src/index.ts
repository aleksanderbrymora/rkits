import fs from 'fs';
import pptr from 'puppeteer';
import axios from 'axios';
import Pool from '@supercharge/promise-pool';
import path from 'path';
import chalk from 'chalk';
import download from 'download';

enum DriveType {
  'google',
  'mediafire',
  'dropbox',
}

const logger = (message: string, payload?: string) => {
  const { log } = console;
  log(chalk.blue('==================='));
  log(chalk.yellow(message));
  payload && log(chalk.white(payload));
};

class Post {
  onlineDrive: DriveType | null;
  constructor(
    public readonly url: string,
    public readonly author: string,
    public readonly title: string,
    public readonly permalink: string,
  ) {
    this.onlineDrive = this.decideOnlineDrive(this.url);
  }

  decideOnlineDrive(url: string): DriveType | null {
    if (url.includes('google')) return DriveType.google;
    if (url.includes('dropbox')) return DriveType.dropbox;
    if (url.includes('mediafire')) return DriveType.mediafire;
    return null;
  }
}

const main = async (): Promise<void> => {
  const { data } = await axios.get('https://www.reddit.com/r/drumkits.json');
  const [, _, ...postsFull] = data.data.children; //ignoring first two cause they are pinned posts
  const posts: Post[] = postsFull.map(({ data }: any) => {
    return new Post(
      data.url as string,
      data['author_fullname'] as string,
      data.title as string,
      ('https://www.reddit.com' + data.permalink) as string,
    );
  });
  logger(
    'Got all the links',
    JSON.stringify(
      posts.map((p) => p.url),
      null,
      2,
    ),
  );
  await fetchFiles(posts);
};

const dropbox = async (post: Post): Promise<void> => {
  logger('Starting the download of', post.title);
  try {
    const link = post.url.replace('dl=0', 'dl=1');
    await download(link, 'kits');
  } catch (error) {
    console.error(error);
    console.log(chalk.red(`${post.title} has failed to download`));
  }
};

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

const downloadFromStorage = async (
  browser: pptr.Browser,
  post: Post,
): Promise<void> => {
  logger(`Starting the download of`, post.title);
  switch (post.onlineDrive) {
    case DriveType.dropbox:
      // await dropbox(browser, post);
      await dropbox(post);
      break;
    case DriveType.google:
      // await google(browser, post);
      break;
    case DriveType.mediafire:
      // await mediafire(browser, post);
      break;
    default:
      logger('Unknown online drive');
      break;
  }
};

const fetchFiles = async (posts: Post[]): Promise<void> => {
  const browser = await pptr.launch({ devtools: true });
  const { results, errors } = await Pool.withConcurrency(2)
    .for(posts)
    .process((p) => downloadFromStorage(browser, p));

  await browser.close();
  logger('All done');
};

main();
