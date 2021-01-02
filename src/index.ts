import Pool from '@supercharge/promise-pool';
import axios from 'axios';
import chalk from 'chalk';
import download from 'download';
import pptr from 'puppeteer';
import { logger } from './logger';
import { Post } from './Post';
import { Dropbox } from './Dropbox';

export enum DriveType {
  'google',
  'mediafire',
  'dropbox',
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


const downloadFromStorage = async (
  browser: pptr.Browser,
  post: Post,
): Promise<void> => {
  logger(`Starting the download of`, post.title);
  switch (post.onlineDrive) {
    case DriveType.dropbox:
      const d = new Dropbox(post);
      await d.download();
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
