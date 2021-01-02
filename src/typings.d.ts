declare module 'wetransfert' {
  function download(link: string, destinationFolder: string): Promise<any>;
}
