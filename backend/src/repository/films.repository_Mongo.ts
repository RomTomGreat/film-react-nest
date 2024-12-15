import { Inject } from '@nestjs/common';
import { Model } from 'mongoose';
import { Film } from '../films/schema/films.schema';
import { GetFilmDto } from '../films/dto/films.dto';
import { InternalServerError } from '../errors/internal_server_error';
import { NotFoundError } from '../errors/not_found_error';

export class FilmsRepositoryMongo {
    constructor(@Inject('FILM_DB') private filmRepository: Model<Film>) {}

    private getFilm(): (filmFromDB: Film) => GetFilmDto {
        return (root) => {
            return {
                id: root.id,
                rating: root.rating,
                director: root.director,
                tags: root.tags,
                image: root.image,
                cover: root.cover,
                title: root.title,
                about: root.about,
                description: root.description,
                schedule: root.schedule,
            };
        };
    }

    async findAllFilms(): Promise<{ total: number; items: GetFilmDto[] }> {
        const films = await this.filmRepository.find({});
        const total = films.length;
        return {total, items: films.map(this.getFilm())};
    }

    async findFilmById(filmId: string): Promise<GetFilmDto> {
        try {
            return await this.filmRepository.findOne({ id: filmId });
        } catch (error) {
            throw new NotFoundError(`Этот фильм с id ${filmId} не найден`);
        }
    }

    async getSessionData(filmId: string, sessionId: string): Promise<string[]> {
        try {
            const film = await this.filmRepository.findOne({ id: filmId });
            const sessionIndex = film.schedule.findIndex((session) => {
                return session.id === sessionId;
            });
            return film.schedule[sessionIndex].taken;
        } catch (error) {
            throw new NotFoundError(`Сеанс с id ${sessionId} не существует`);
        }
    }

    async pickUpAnEmptySeat(
        filmId: string,
        sessionId: string,
        seats: string,
    ): Promise<string[]> {
        const film = await this.filmRepository.findOne({ id: filmId });
        const sessionIndex = film.schedule.findIndex((session) => {
            return session.id === sessionId;
        });
        try {
            await this.filmRepository.updateOne(
                { id: filmId },
                { $push: { [`schedule.${sessionIndex.toString()}.taken`]: seats } },
            );
        return;
        } catch (error) {
            new InternalServerError('Ошибка на сервере');
        }
    }
}