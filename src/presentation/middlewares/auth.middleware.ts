
import { NextFunction, Request, Response } from "express";
import { JwtAdapter } from "../../config/jwt.adapter";
import { Status, User } from "../../data";


//Gestionando la autenticación y autorización en las rutas
export class AuthMiddleware {
       // Método estático para proteger rutas que requieren autenticación
    static async protect(req: Request, res: Response, next: NextFunction) {
        const authorization = req.header("Authorization");

        if (!authorization) return res.status(401).json({ message: "No token provided" });

        if (authorization.startsWith("Bearer ")) return res.status(401).json({ message: "🚫 Invalid Token 🔑❌" });

        const token = authorization.split('').at(1) || "";

        try {
            const payload = (await JwtAdapter.validateToken(token)) as { id: string };
            if (!payload) return res.status(401).json({ message: "🚫 Invalid Token 🔑❌" })

            const user = await User.findOne({
                where: {
                    id: payload.id,
                    status: Status.AVALIABLE,
                },
            });
            if (!user) return res.status(401).json({ message: "🚫❌ Invalid User 🔍" });

            req.body.sessionUser = user;
            next();

        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: "💥❌ Internal Server Error 🚨" })
        }

        console.log(token);
    }

    static restricTo(...Role: any) {
        return (req: Request, res: Response, next: NextFunction) => {
            if (Role.includes(req.body.sessionUser.role)) {
                return res.status(403).json({ message: "🚫❌ You are not authorized to access this route 🔒" })
            }
            next();
        }
    };
}
