import { Download } from './Download';
import { Post } from './Post';
import pptr from 'puppeteer';

export class Mediafire extends Download {
  constructor(post: Post, url: string) {
    super(url, post);
  }
}

export const createMediafire = async (post: Post): Promise<Mediafire> => {
  const browser = await pptr.launch();
  const page = await browser.newPage();
  await page.goto(post.url);
  await page.waitForNavigation({ waitUntil: 'networkidle0' });
  const link = await page.evaluate(() => {
    const a = document.querySelector<HTMLLinkElement>('#downloadButton');
    return a!.href;
  });
  console.log(`------ The link for mediafire download ${link}`);
  await browser.close();
  return new Mediafire(post, link);
};
