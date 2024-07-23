import { UserDocument } from './schemas/user.schema';

declare global {
  declare namespace Express {
    export interface Request {
      user: UserDocument;
    }
    export interface Response {
      user: UserDocument;
    }
  }
}
