import { type BaseSchema } from "./base.dto";

export interface IUser extends BaseSchema {
  name: string;
  email: string;
  password: string;
  active?: boolean;
  role: "USER" | "ADMIN";
  kycCompleted: boolean;
  kycPhoto?: string;
}
