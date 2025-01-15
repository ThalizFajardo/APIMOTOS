import { DataSource } from "typeorm";
import { User } from "./models/user.model";
import { Repair } from "./models/repair.model";


interface Options {
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
}

export class PostgresDatabase {
    public datasource: DataSource;

    constructor(options: Options) {
        this.datasource = new DataSource({
            type: 'postgres',
            host: options.host,
            port: options.port,
            username: options.username,
            password: options.password,
            database: options.database,
            entities :[User,Repair], 
            synchronize: true,
            ssl:{
                rejectUnauthorized: false
            }
        });
    }

    async connect() {
        try {
            await this.datasource.initialize()
            console.log("🎉✨ La base de datos se ha conectado exitosamente: ¡Todo está listo para comenzar! 🌟😀")
        } catch (error) {
            console.log(error)
        }
    }
}

// Exportar una instancia global si no hacia esto me daba error
export const AppDatabase = new PostgresDatabase({
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432", 10),
    username: process.env.DB_USERNAME || "postgres",
    password: process.env.DB_PASSWORD || "password",
    database: process.env.DB_DATABASE || "testdb",
  });