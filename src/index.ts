import Pool from '@supercharge/promise-pool';
import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';
import { Dropbox } from './Dropbox';
import { Google } from './Google';
import { logger } from './logger';
import { createMediafire } from './Mediafire';
import { Post } from './Post';

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

const downloadFromStorage = async (post: Post): Promise<void> => {
  switch (post.onlineDrive) {
    case 'dropbox':
      const dropbox = new Dropbox(post);
      await dropbox.download();
      break;
    case 'google':
      const google = new Google(post);
      // await google.download();
      break;
    case 'mediafire':
      const mediafire = await createMediafire(post);
      await mediafire.download();
      break;
    default:
      logger('Unknown online drive');
      break;
  }
};

const createKitsFolder = async () => {
  try {
    await fs.mkdir(path.resolve('kits'));
    console.log('Created the kits folder');
  } catch (err) {
    console.log('Kits folder already exists');
  }
};

const fetchFiles = async (posts: Post[]): Promise<void> => {
  await createKitsFolder();
  logger(`Starting to download the files`);
  const { results, errors } = await Pool.withConcurrency(5)
    .for(posts)
    .process((p) => downloadFromStorage(p));

  logger('All done');
};

main();
