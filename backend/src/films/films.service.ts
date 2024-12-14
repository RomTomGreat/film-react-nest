import { Inject, Injectable } from '@nestjs/common';
import { AppConfig } from '../app.config.provider';
import { FilmsRepositoryMongo } from '../repository/films.repository_Mongo';
import { FilmsRepositoryPostgres } from '../repository/films.repository_Postgres';

@Injectable()
export class FilmsService {
    constructor(@Inject('CONFIG') private readonly config: AppConfig, private readonly filmRepositoryMongo: FilmsRepositoryMongo, private readonly filmRepositoryPostgres: FilmsRepositoryPostgres) {}

    async findAll() {
        if (this.config.database.driver === 'mongodb') {
            return this.filmRepositoryMongo.findAllFilms();
        } else if (this.config.database.driver === 'postgres') {
            return this.filmRepositoryPostgres.findAllFilms();
        }
    }

    async findById(id: string) {
        if (this.config.database.driver === 'mongodb') {
            return this.filmRepositoryMongo.findFilmById(id);
        } else if (this.config.database.driver === 'postgres') {
            return this.filmRepositoryPostgres.findFilmById(id);
        }
    }
}
