import { AccountStatusEnum, GenderEnum, ICommon, IsDefaultEnum } from "@/enums/common";
import { IRole } from "../../system-role/types/role-type";

export interface IUser extends ICommon {
  id: number;
  username: string;
  status: AccountStatusEnum;
  isDefault: IsDefaultEnum;
}

export interface IProfile extends ICommon {
  id: number;
  nickname: string;
  avatar: string;
  gender: GenderEnum;
  phone: string | null;
  address: string | null;
}

export interface IUserProfile extends IUser {
  profile: IProfile;
  role:IRole
}
