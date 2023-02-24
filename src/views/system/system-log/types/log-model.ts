import { IUser } from './../../system-user/types/user-type';
import { ICommon } from '@/enums/common';
export interface ILog extends ICommon {
  ip: string;
  name: string;
  method: string;
  code: number;
  path: string;
  time: number;
  user:IUser
}