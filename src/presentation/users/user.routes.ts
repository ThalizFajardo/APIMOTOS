import { Router } from 'express';
import { UserController } from './user.controller';
import { UserService } from '../services/user.service';
import { EmailService } from "../services/email.service";
import { envs } from "../../config";
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { Role } from '../../data';

export class UserRoutes {
    static get routes(): Router {
        const router = Router();

        const emailService = new EmailService(
            envs.MAILER_SERVICE,
            envs.MAILER_EMAIL,
            envs.MAILER_SECRET_KEY,
            envs.SEND_EMAIL
        );

        const userService = new UserService(emailService);
        const userController = new UserController(userService);

        router.get("/", userController.findAllUser);
        router.get("/:id", userController.findOneUser);
        router.patch("/:id", userController.updateUser);
        router.delete("/:id", userController.deleteUser);

       
        router.post('/login', userController.login);
        router.post('/register', userController.register);
        router.get('user/validate-email/:token', userController.validateAccount);


        router.use(AuthMiddleware.protect);

        router.get("/profile", userController.getProfile);
        router.patch("/block-account/:id", AuthMiddleware.restricTo(Role.EMPLOYEE), userController.blockAccount);


        return router;//vamonos a routes.ts
    }
}