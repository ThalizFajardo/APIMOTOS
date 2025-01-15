import "reflect-metadata"; // Necesario para TypeORM
import { envs } from "./config/env";// Variables de entorno
import { PostgresDatabase } from "./data/postgress/postgress-database"; // Clase de la base de datos
import { AppRoutes } from "./presentation/routes"; // Clase que gestiona rutas
import { Server } from "./presentation/server"; // Clase del servidor

// Función principal para inicializar la aplicación
async function main() {
  // Configuración de la base de datos
  const postgres = new PostgresDatabase({
    username: envs.DB_USERNAME,
    password: envs.DB_PASSWORD,
    host: envs.DB_HOST,
    database: envs.DB_DATABASE,
    port: envs.DB_PORT,
  });

  await postgres.connect(); // Conexión a la base de datos

  // Configuración del servidor
  const server = new Server({
    port: envs.PORT,
    routes: AppRoutes.routes,
  });

  await server.start(); // Inicialización del servidor
}


main();