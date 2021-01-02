import Pool from '@supercharge/promise-pool';
import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';
import { Dropbox } from './Drives/Dropbox';
import { createMediafire } from './Drives/Mediafire';
import { logger } from './logger';
import { Post } from './Post';
import { Wetransfer } from './Drives/Wetransfer';

const debug = true;

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
      if (debug) break;
      const dropbox = new Dropbox(post);
      await dropbox.download();
      break;

    case 'google':
      if (debug) break;
      logger(
        'Google Drive currently unsupported cause their websites are cryptic as fuck.\nThis url has been ignored:',
        post.title,
      );
      // const google = new Google(post);
      // await google.download();
      break;

    case 'mediafire':
      if (debug) break;
      const mediafire = await createMediafire(post);
      await mediafire.download();
      break;

    case 'wetransfer':
      const wetransfer = new Wetransfer(post);
      await wetransfer.download();
      break;

    default:
      if (debug) break;
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
  await Pool.withConcurrency(2)
    .for(posts)
    .process((p) => downloadFromStorage(p));

  logger('All done');
};

main();
