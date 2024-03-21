export type Dictionary = {
  [key: string]: any;
};

export type MenuAuth = {
  [key: string]: number;
};

export type UploadFile = {
  key: string;
  folder: string;
  ymd: string;
  name: string;
  size: number;
  type: string;  
}

export enum PermMethod {
  read = 0,
  create,
  update,
  delete,
  admin,
  etc1,
  etc2,
  etc3,
  etc4,
  etc5,
  void,
};

export const contentType = {
  excel: "application/vnd.ms-excel",
  stream: "application/octet-stream"
}