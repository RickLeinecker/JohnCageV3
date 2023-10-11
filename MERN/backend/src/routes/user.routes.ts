import { Router } from "express";
import UserController from "../controllers/user.controller";

class UserRoutes {
  router = Router();
  controller = new UserController();

  constructor() {
    this.intializeRoutes();
  }

  intializeRoutes() {

    this.router.get('/validate', this.controller.validateToken);
    this.router.post('/register', this.controller.register);
    this.router.post('/login', this.controller.login);
    this.router.get('/findAll', this.controller.getAllUsers);


    // Create a new User
    // this.router.post("/", this.controller.create);

    // Retrieve all Users
    // this.router.get("/", this.controller.findAll);

    // Retrieve a single User with id
    this.router.get("/:id", this.controller.findOne);

    // Update a User with id
    this.router.put("/:id", this.controller.update);

    // Delete a User with id
    this.router.delete("/:id", this.controller.delete);
  }
}

export default new UserRoutes().router;