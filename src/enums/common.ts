export enum GenderEnum {
  MALE = 1,
  FEMALE = 2,
}

export enum IsDefaultEnum {
  YES = 1,
  NO = 2,
}

export enum Status {
  ENABLE = 1,
  DISABLE = 2,
}

export enum AccountStatusEnum {
  NORMAL = 1,
  DISABLE = 2,
  DELETE = 3,
}

export interface ICommon {
  id: number;
  createdAt: string;
  updatedAt: string;
  isDefault?: IsDefaultEnum;
}

export enum BooleanEnum {
  TRUE = 1,
  FALSE = 0,
}
