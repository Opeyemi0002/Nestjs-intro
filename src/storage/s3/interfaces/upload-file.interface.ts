import { UploadType } from '../enum/upload.enum';

export interface UploadFileData {
  key: string;
  fileType: UploadType;
  mimeType: string;
  fileSize: number;
  path: string;
}
