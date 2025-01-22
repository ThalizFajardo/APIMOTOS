// repair.routes.ts
import { Router } from 'express';
import { RepairController } from './repair.controller';
import { RepairService } from '../services/repair.service';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { Role } from '../../data';

export class RepairRoutes {
    static get routes(): Router {
        const router = Router();
        
        const repairService = new RepairService();
        const repairController = new RepairController(repairService);
        
        router.post("/", repairController.createRepair);

        router.use(AuthMiddleware.protect);

        router.get("/", repairController.findAllRepairs);
        router.get("/:id",AuthMiddleware.restricTo(Role.EMPLOYEE) ,repairController.findOneRepair);
        router.patch("/:id",AuthMiddleware.restricTo(Role.EMPLOYEE), repairController.updateRepair);
        router.delete("/:id",AuthMiddleware.restricTo(Role.EMPLOYEE) ,repairController.delete);
      
        return router;
    }
}