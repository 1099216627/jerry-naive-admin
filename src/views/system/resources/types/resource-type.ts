import { ICommon } from '@/enums/common';
export interface IResource extends ICommon {
  name: string;
  url: string;
  description: string;
  cover: string;
}