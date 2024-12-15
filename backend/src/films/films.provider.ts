import { AppConfig } from "../app.config.provider";
import { Film } from "./entities/film.entity";
import { FilmSchema } from "./schema/films.schema";

export const FilmsProvider = {
    provide: 'FILM_DB',
    inject: ['DB_CONNECT', 'CONFIG'],
    useFactory: (connection, config: AppConfig) => {
        if (config.database.driver === 'postgres') {
            return connection.getRepository(Film);
        } else if (config.database.driver === 'mongodb') {
            return connection.model('Film', FilmSchema);
        }
    }
};