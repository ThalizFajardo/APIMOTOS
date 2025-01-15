// repair.routes.ts
import { Router } from 'express';
import { RepairController } from './repair.controller';
import { RepairService } from '../services/repair.service';

export class RepairRoutes {
    static get routes(): Router {
        const router = Router();


        const repairService = new RepairService();
        const repairController = new RepairController(repairService);
        
        router.get("/", repairController.findAllRepairs);
        router.get("/:id", repairController.findOneRepair);
        router.post("/", repairController.createRepair);
        router.patch("/:id", repairController.updateRepair);
        router.delete("/:id", repairController.delete);
      
        return router;
    }
}