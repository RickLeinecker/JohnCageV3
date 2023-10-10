import { Router } from "express";
import UserController from "../controllers/user.controller";
import { Middleware } from "../middleware/middleware.index";

class UserRoutes {
  router = Router();
  controller = new UserController();

  constructor() {
    this.intializeRoutes();
  }

  intializeRoutes() {

    this.router.get(
      // Route
      '/validate',

      // Express Middleware
      [
        Middleware.verifyToken.extractJWT
      ],

      // User class (controller) method
      this.controller.validateToken
    );

    this.router.post(
      // Route
      '/register',

      // Express Middleware
      [
        Middleware.verifyRegister.checkDuplicateUsernameOrEmail
      ],

      this.controller.register,
    );

    this.router.post(
      '/login',
      this.controller.login
    );

    // Retrieve all Users
    this.router.get(
      '/findAll',
      this.controller.getAllUsers
    );

    // Retrieve a single User with id
    this.router.get(
      "/:id",
      this.controller.findOne
    );

    // Update a User with id
    this.router.put(
      "/:id",
      this.controller.update
    );

    // Delete a User with id
    this.router.delete(
      "/:id",
      this.controller.delete
    );
  }
}

export default new UserRoutes().router;