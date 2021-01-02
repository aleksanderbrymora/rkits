import { DriveType } from './index';

export class Post {
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
