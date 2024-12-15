import { Inject, Injectable } from '@nestjs/common';
import { AppConfig } from '../app.config.provider';
import { FilmsRepositoryMongo } from '../repository/films.repository_Mongo';
import { FilmsRepositoryPostgres } from '../repository/films.repository_Postgres';

@Injectable()
export class FilmsService {
    constructor(@Inject('CONFIG') private readonly config: AppConfig, private readonly filmRepositoryMongo: FilmsRepositoryMongo, private readonly filmRepositoryPostgres: FilmsRepositoryPostgres) {}

    async findAll() {
        const repository = this.config.database.driver === 'mongodb' ? this.filmRepositoryMongo : this.filmRepositoryPostgres;
        return repository.findAllFilms();
    }

    async findById(id: string) {
        const repository = this.config.database.driver === 'mongodb' ? this.filmRepositoryMongo : this.filmRepositoryPostgres;
        const result = await repository.findFilmById(id);
        return { total: result.schedule.length, items: result.schedule };
    }
}
