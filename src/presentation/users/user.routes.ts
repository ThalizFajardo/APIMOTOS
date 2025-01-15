import { Router } from 'express';
import { UserController } from './user.controller';
import { UserService } from '../services/user.service';


export class UserRoutes {
    static get routes(): Router {
        const router = Router();

        const userService = new UserService();
        const userController = new UserController(userService);

        router.get("/", userController.findAllUser);
        router.get("/:id", userController.findOneUser);
        router.post("/", userController.createUser);
        router.patch("/:id", userController.updateUser);
        router.delete("/:id", userController.deleteUser);
 
        return router;
    }
}