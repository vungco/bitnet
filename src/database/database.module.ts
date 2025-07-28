import { Module } from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import { DatabaseConfig } from "./config";


@Module({
    imports : [
        TypeOrmModule.forRootAsync({
            useClass : DatabaseConfig,
        }),
        TypeOrmModule.forFeature([])
    ],
    controllers : [],
    providers : [],
    exports : [],
})
export class DatabaseModule {}