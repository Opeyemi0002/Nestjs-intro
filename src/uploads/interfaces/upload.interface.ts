import { fileType } from '../enum/filetype.enum';

export interface UploadFile {
  name: string;
  path: string;
  type: fileType;
  mime: string;
  size: number;
}
