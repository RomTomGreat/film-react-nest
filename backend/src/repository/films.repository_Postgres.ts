import { Inject } from "@nestjs/common";
import { Film } from "../films/entities/film.entity";
import { Repository } from "typeorm";
import { NotFoundError } from "../errors/not_found_error";
import { InternalServerError } from "../errors/internal_server_error";

export class FilmsRepositoryPostgres {
    constructor( @Inject('FILM_DB') private filmRepository: Repository<Film> ) {}

    async findAllFilms(): Promise<{ total: number; items: Film[] }> {
        const [total, items] = await Promise.all([
            this.filmRepository.count(),
            this.filmRepository.find({ relations: { schedule: true } }),
        ]);

        return { total, items };
    }

    async findFilmById(filmId: string): Promise<Film> {
        try {
            return this.filmRepository.findOne({
                where: { id: filmId },
                relations: { schedule: true }
            });
        } catch (error) {
            throw new NotFoundError(`Этот фильм с id ${filmId} не найден`);
        }
    }

    async getSessionData(filmId: string, sessionId: string) {
        try {
            const film = await this.filmRepository.findOne({
                where: { id: filmId },
                relations: { schedule: true },
            });
            const sessionIndex = film.schedule.findIndex((session) => {
                return session.id === sessionId;
            });
            return film.schedule[sessionIndex].taken;
        } catch (error) {
            throw new NotFoundError(`Сеанс с id ${sessionId} не существует`);
        }
    }

    async pickUpAnEmptySeat(filmId: string, sessionId: string, seats: string) {
        const film = await this.filmRepository.findOne({
            where: { id: filmId },
            relations: { schedule: true }
        });
        const sessionIndex = film.schedule.findIndex((session) => {
            return session.id === sessionId;
        });
        const previousData = film.schedule[sessionIndex].taken;
        const newData = previousData.concat(seats);
        film.schedule[sessionIndex].taken = newData;
        try {
            await this.filmRepository.save(film);
            return;
        } catch (error) {
            new InternalServerError('Ошибка на сервере');
        }
    }
}