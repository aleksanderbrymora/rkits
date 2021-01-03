declare module 'wetransfert' {
  function download(link: string, destinationFolder: string): Promise<response>;
}

declare interface response {
  content: {
    id: string;
    state: string;
    transfer_type: number;
    shortened_url: string;
    expires_at: string;
    password_protected: boolean;
    uploaded_at: string;
    expiry_in_seconds: number;
    size: number;
    deleted_at: null | string;
    recipient_id: null | string;
    display_name: string;
    security_hash: string;
    description: string;
    downloadURI: string;
    sessionCookie: string;
    csrf: string;
    items: {
      id: string;
      name: string;
      retries: number;
      size: number;
      item_type: string;
      previewable: boolean;
      content_identifier: string;
    }[];
  };
}
