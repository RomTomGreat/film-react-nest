import { ConfigModule } from '@nestjs/config';

export const ConfigProvider = {
    imports: [ConfigModule.forRoot()],
    provide: 'CONFIG',
    useValue: <AppConfig> {
        database: {
            url: process.env.DATABASE_URL,
            driver: process.env.DATABASE_DRIVER,
            host: process.env.DATABASE_HOST,
            port: process.env.DATABASE_PORT,
            username: process.env.DATABASE_USERNAME,
            password: process.env.DATABASE_PASSWORD,
            database_name: process.env.DATABASE_DATABASE
        }
    },
}

export interface AppConfig {
    database: AppConfigDatabase;
}

export interface AppConfigDatabase {
    url?: string;
    driver: string;
    host: string;
    port?: string;
    username?: string;
    password?: string;
    database_name?: string;
}
