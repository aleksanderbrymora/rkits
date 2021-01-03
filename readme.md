# RKits

## Intro

Yet another (this time successful) implementation of mine, of a downloader for drumkits from r/drumkits.
It grabs latest links from [r/drumkits](https://www.reddit.com/r/Drumkits/) and downloads them to the specified folder

It now successfully downloads from:

- Dropbox
- WeTransfer
- Mediafire

It uses different tactics for each of these to get the download the pack, like web-scraping, npm-packages or url manipulation.
If you're feeling like doing a challenge have a go at implementing a download from Google Drive because I have no idea how to.

## Instructions

- Clone the repo
- Install the dependencies

```bash
yarn
# or
npm i
```

- run the main script with

```bash
yarn start
```

## Roadmap

I have no idea how to do downloading from Google without requiring API key, so I need to either figure out how to scrape it or find some kind of package that will take a url and do whatever it needs to in order to download the package.
Another big problem with Google Drive is that many people share the folder in different ways so the program would have to account for that