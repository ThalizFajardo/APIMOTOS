import { AppDatabase } from "../../data/postgress/postgress-database";
import { Repair, RepairStatus } from "../../data/postgress/models/repair.model";
import { CreateRepairDTO } from "../../domain";
import { CustomError } from "../../domain";

export class RepairService {
  
  async findAll() {
    try {
      return await Repair.find({
        where:{
          status : RepairStatus.PENDING,
        }
      }); 
    } catch (error) {
      throw CustomError.internalServer("⚠️ Hubo un error al obtener las reparaciones:");
    }
  }

  async create(data:CreateRepairDTO) {
    const repair = new Repair(); 
    
    repair.date = data.date;
    repair.userId = data.userId;
    
    try {
       return await repair.save();  
    } catch (error) {
      throw CustomError.internalServer('⚠️ Hubo un error al crear la reparación:');
    }
  }
  


  async findOne(id: string) {
  
      const repair = await Repair.findOne({
        where: {
          status : RepairStatus.PENDING,
          id : id,
         }
      });
      if (!repair) {
        throw CustomError.notFoud(`🔍 Reparación con ID ${id} no encontrada`);
      }

      return repair;  
  }

  async update(id: string) {
    const repair = await this.findOne(id);
    
    repair.status = RepairStatus.COMPLETED;
     
    try{
      await repair.save();
      return {
       message : "Reparacion actualizada a completado"
      };
     } catch (error) {
      throw CustomError.internalServer(`⚠️ Hubo un error al actualizar el estado de la reparación:` );
    }
  }

  async delete(id: string) {
    const repair = await this.findOne(id);
    repair.status = RepairStatus.CANCELLED;
    
    try {
  
      await repair.save();
      return { message: `✅ Reparación con ID ${id} cancelada` };
    } catch (error) {
      throw CustomError.internalServer(`⚠️ Hubo un error al eliminar la reparación:`, );
     
    }
  }
}
