import { DriveType } from './driveType';

export class Post {
  onlineDrive: DriveType;
  constructor(
    public readonly url: string,
    public readonly author: string,
    public readonly title: string,
    public readonly permalink: string,
  ) {
    this.onlineDrive = this.decideOnlineDrive(this.url);
  }

  decideOnlineDrive(url: string): DriveType {
    if (url.includes('google')) return 'google';
    if (url.includes('dropbox')) return 'dropbox';
    if (url.includes('mediafire')) return 'mediafire';
    return 'nothing';
  }
}
