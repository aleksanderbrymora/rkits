import { Download } from './Download';
import { Post } from '../Post';
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
  await page.waitForSelector('button.fc-cta-consent');
  const link = await page.evaluate(() => {
    const consent = document.querySelector<HTMLButtonElement>(
      'button.fc-cta-consent',
    );
    console.log(consent);
    consent?.click();
    const a = document.querySelector<HTMLLinkElement>('#downloadButton');
    return a!.href;
  });
  await browser.close();
  return new Mediafire(post, link);
};
