import dotenv from "dotenv";
import createHttpError from "http-errors";
import app from "./app";
import { bootstrap, createServerFromEnv } from "./server";
dotenv.config();

const PORT = process.env.PORT ? Number(process.env.PORT) : 8080;

if (!PORT) {
    throw createHttpError.InternalServerError('Missing required environment variable: PORT')
}

const server = createServerFromEnv(app);
bootstrap(server, PORT);
