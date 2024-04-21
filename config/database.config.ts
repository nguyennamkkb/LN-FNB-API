import { TypeOrmModuleOptions } from '@nestjs/typeorm';
 
export const databaseConfig = {
    type: process.env.DB_TYPE,
    host: process.env.DB_HOST1,
    port: process.env.DB_PORT1,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: true,
};