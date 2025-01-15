
import { Status, User } from "../../data/postgress/models/user.model";
import { CreateUserDTO } from "../../domain/dtos/user.dto";
import { CustomError } from "../../domain";
import { UpdateUserDTO } from "../../domain/dtos/updateUser.dto";


export class UserService {

    async findOne(id: string) {
        const user = await User.findOne({
            where: {
                status: Status.AVALIABLE,
                id: id,
            }
        });
        if (!user) {
            throw CustomError.notFoud(`🔍 Reparación con ID ${id} no encontrada`);
        }

        return user;
    }



    async findAll() {
        try {
            const users = await User.find({
                where: {
                    status: Status.AVALIABLE,
                },
            });
            return users;
        } catch (error) {
            throw CustomError.internalServer(`Error al obtener los usuarios`);
        }
    }




    async create(data: CreateUserDTO) {
        const user = new User();

        user.name = data.name;
        user.email = data.email;
        user.password = data.password;
        user.role = data.role;

        try {
            return await user.save();
        } catch (error) {
            throw CustomError.internalServer(' Error al crear el usuario: ',);

        }
    }


    async update(id: string, data: UpdateUserDTO) {
        const user = await this.findOne(id);

        user.name = data.name;
        user.email = data.email;

        try {
            await user.save();

            return {
                message: "User Updated",
            };
        } catch (error) {
            throw CustomError.internalServer(`Error al actualizar el usuario con ID ${id}:`);

        }
    }

    async delete(id: string, data: UpdateUserDTO) {
        const user = await this.findOne(id);

        user.name = data.name;
        user.email = data.email;

        try {
            await user.save();

            return {
                message: "User Updated",
            };
        } catch (error) {
            throw CustomError.internalServer(`Error al actualizar el usuario con ID ${id}:`);

        }
    }

}
