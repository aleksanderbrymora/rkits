import { Download } from './Download';
import { Post } from '../Post';
import pptr from 'puppeteer';

export class Mediafire extends Download {
  constructor(post: Post, url: string) {
    super(url, post);
  }
}

/**
 * Create an instance of MediaFire class that has a method to download the file
 * from MediaFire. I needed to use this pattern because async stuff wasn't possible
 * in the constructor of the class and i needed to get the download link first
 * @param {Post} post - a single post from the reddit api
 */
export const createMediafire = async (post: Post): Promise<Mediafire> => {
  /*
    It would be possible to do this without web-scraping,
    but MediaFire seams to swap the file server to better serve the download
    and its impossible to know which one will be used for this download.
    So yeah its kind of expensive to launch a whole browser for each link,
    but it definitely works and is worth it for bigger files since they should
    download faster from a closer server
   */
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
