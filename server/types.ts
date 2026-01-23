export type ImageSubmittedEvent = {
  name: "image/submitted";
  data: {
    imageId: string;
    storagePath: string;
  };
};

export type Events = {
  "image/submitted": ImageSubmittedEvent;
};
