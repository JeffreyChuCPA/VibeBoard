import { Application } from "express";
import keyboards from "../routes/keyboards";
import user from "../routes/user"

export default function(app: Application): void {
  app.use("/api/keyboard_themes", keyboards);
  app.use("/api/user", user)
}