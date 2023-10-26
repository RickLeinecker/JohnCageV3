import { Request, Response } from "express";

class HomeController {
  async welcome(req: Request, res: Response) {
    return res.json({ message: "Welcome to JCT application." });
  }
}

export default HomeController;