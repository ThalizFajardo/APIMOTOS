import { Repair, RepairStatus } from "../../data/postgress/models/repair.model";
import { CreateRepairDTO } from "../../domain";
import { CustomError } from "../../domain";

export class RepairService {

  async findAll() {
    try {
      return await Repair.find({
        where: {
          status: RepairStatus.PENDING,
        }
      });
    } catch (error) {
      throw CustomError.internalServer("⚠️ There was an error fetching the repairs:");
    }
  }

  async create(data: CreateRepairDTO) {
    const repair = new Repair();

    repair.date = data.date;
    repair.userId = data.userId;

    try {
      return await repair.save();
    } catch (error) {
      throw CustomError.internalServer('⚠️ There was an error creating the repair:');
    }
  }

  async findOne(id: string) {

    const repair = await Repair.findOne({
      where: {
        status: RepairStatus.PENDING,
        id: id,
      }
    });
    if (!repair) {
      throw CustomError.notFoud(`🔍 Repair with ID ${id} not found 🚫`);
    }

    return repair;
  }

  async update(id: string) {
    const repair = await this.findOne(id);

    repair.status = RepairStatus.COMPLETED;

    try {
      await repair.save();
      return {
        message: "✅ Repair updated to completed 🎉"
      };
    } catch (error) {
      throw CustomError.internalServer(`⚠️ There was an error updating the repair status:`);
    }
  }

  async delete(id: string) {
    const repair = await this.findOne(id);
    repair.status = RepairStatus.CANCELLED;

    try {

      await repair.save();
      return { message: `✅ Repair with ID ${id} canceled 🎉` };
    } catch (error) {
      throw CustomError.internalServer(`⚠️ There was an error deleting the repair:`,);

    }
  }
}
