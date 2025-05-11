import { UserDocument } from "../db/users"; // adjust this import path

declare global {
  namespace Express {
    interface Request {
      identity?: UserDocument;
    }
  }
}
