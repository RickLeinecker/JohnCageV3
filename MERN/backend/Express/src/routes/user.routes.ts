import { Router } from 'express';
import UserController from '../controllers/user.controller';
import { Middleware } from '../middleware/middleware.index';

class UserRoutes {
  router = Router();
  controller = new UserController();

  constructor() {
    this.intializeRoutes();
  }

  intializeRoutes() {
    this.router.get(
      '/validate',

      [Middleware.extractJWT],

      this.controller.validateToken
    );

    this.router.post(
      '/register',

      [Middleware.checkDuplicateUsernameOrEmail],

      this.controller.register
    );

    // Verify email
    this.router.get(
      '/verify-email/:token',

      this.controller.verifyEmail
    );

    this.router.post('/forgot-password', this.controller.forgotPassword);

    this.router.post('/login', this.controller.login);

    // Retrieve all Users
    this.router.get('/findAll', this.controller.getAllUsers);

    // Retrieve a single User with id
    this.router.get('/:id', this.controller.findOne);

    // Update a User with id
    this.router.put('/:id', this.controller.update);

    // Delete a User with id
    this.router.delete('/:id', this.controller.delete);
  }
}

export default new UserRoutes().router;
