import { ICommon } from '@/enums/common';
export interface IRessource extends ICommon {
  name: string;
  url: string;
  description: string;
  cover: string;
}