import { Injectable } from "@nestjs/common";
import {TypeOrmModuleOptions , TypeOrmOptionsFactory} from "@nestjs/typeorm";

@Injectable()
export class DatabaseConfig implements TypeOrmOptionsFactory {
    createTypeOrmOptions(): TypeOrmModuleOptions {
        return {
            type: "postgres",
            host: process.env.DB_HOST || "localhost",
            port: Number(process.env.DB_PORT) || 5432,
            username: process.env.DB_USERNAME || "postgres",
            password: process.env.DB_PASSWORD || "123456",
            database: process.env.DB_DATABASE || "bitnet",
            synchronize: Boolean(process.env.DB_SYNC) || true,
            autoLoadEntities: true,
            logging: false,
        }
    }
}