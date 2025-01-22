
import { Status, User } from "../../data/postgress/models/user.model";
import { RegisterUserDTO } from "../../domain/dtos/users/registerUser.dto";
import { CustomError } from "../../domain";
import { UpdateUserDTO } from "../../domain/dtos/users/updateUser.dto";
import { LoginUserDto } from "../../domain";
import { encriptAdapter, envs } from "../../config";
import { JwtAdapter } from "../../config/jwt.adapter";
import { EmailService } from "./email.service";

export class UserService {
    constructor(private readonly emailService: EmailService) { }

    async login(credentials: LoginUserDto) {

        const user = await this.findUserByEmail(credentials.email);//encontrar al usuario

        const isMatching = await encriptAdapter.compare(//validarsi es correcto el password
            credentials.password,
            user.password
        );
        if (!isMatching) throw CustomError.unAuthorized("🚫 Invalid Credentials 🔑");

        const token = await JwtAdapter.generateToken({ id: user.id }, envs.JWT_EXPRIRE_IN); //todo bien se logeó correctamente 
        if (!token) throw CustomError.internalServer("❌ Error while creating JWT 🔒");

        return {//enviando data al cliente..
            token: token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        };
    }

    async register(userData: any) {

        const user = new User();//guardando data....

        user.name = userData.name;
        user.email = userData.email;
        user.password = userData.password;

        try {
            const dbUser = await user.save();

            await this.sendEmailValidationLink(dbUser.email);

            return {
                id: dbUser.id,
                name: dbUser.name,
                email: dbUser.email,
            };
        } catch (error: any) {
            if (error.code === "23505") {//23505 => error de duplicidad
                throw CustomError.badRequest(
                    `⚠️ User with email: ${userData.email} already exists 🚫`
                );
            }
            throw CustomError.internalServer("❌ Error while creating user ⚠️");
        }
    }

    async findUserByEmail(email: string) {
        const user = await User.findOne({
            where: {
                email: email,
                status: Status.AVALIABLE
            },
        });

        if (!user) throw CustomError.notFoud(`🔍User with email: ${email} not found`);

        return user;
    }

    public sendEmailValidationLink = async (email: string) => {
        const token = await JwtAdapter.generateToken({ email }, "300s");
        if (!token) throw CustomError.internalServer("Error getting token");

        const link = `http://${envs.WEB_SERVICE_URL}/api/user/validate-email/${token}`;
        const html = `
          <h1>Validate your email</h1>
          <p>Click on the following link to validate your email</p>
          <a href="${link}">Validate your email: ${email}</a>
        `;
        const isSent = this.emailService.sendEmail({
            to: email,
            subject: "Validate your account",
            htmlBody: html,
        });
        if (!isSent) throw CustomError.internalServer("📧❌ Error sending email 🚫");

        return true;
    };

    validateEmail = async (token: string) => {
        const payload = await JwtAdapter.validateToken(token);
        if (!payload) throw CustomError.badRequest("🚫 Invalid Token 🔑❌");

        const { email } = payload as { email: string };
        if (!email) throw CustomError.internalServer("📧❌ Email not in token 🚫");

        const user = await User.findOne({ where: { email: email } });
        if (!user) throw CustomError.internalServer("📧❌ Email does not exist 🚫");

        user.status = Status.AVALIABLE;

        try {
            await user.save();

            return {
                message: "✅ Usuario activado 🎉",
            };
        } catch (error) {
            throw CustomError.internalServer("⚠️❌ Something went very wrong 😥");
        }
    };

    async getUserProfile(user: User) {
        return {
            id: user.id,
            name: user.name,
            email: user.email,

        }
    }

    async findOne(userId: string) {
        const result = await User.createQueryBuilder("user")
            .where("user.id = :id", { id: userId })
            .andWhere("user.status = :userStatus", { userStatus: Status.AVALIABLE })
            .getOne();

        if (!result) {
            throw CustomError.notFoud("🔍❌ User not found 🚫");
        }

        return result;
    };

    async blockAccount(userId: string) {
        const user = await this.findOne(userId); // Reutilizando el método para encontrar al usuario

        user.status = Status.BLOCKED; // Agregamos un nuevo estado en el modelo que en teoria es lo mismo que "disabled" pero...

        try {
            await user.save();

            return {
                message: `User with ID ${userId} has been blocked successfully.`
            };
        } catch (error) {
            console.error("Error blocking account:", error);
            throw CustomError.internalServer(`⚠️ Error blocking user with ID ${userId}: 🚫`);
        }
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
            throw CustomError.internalServer(`⚠️ Error updating user with ID ${id}: 🚫`);

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
            throw CustomError.internalServer(`⚠️ Error deleting the user with ID ${id}: 🚫`);

        }
    }

}
