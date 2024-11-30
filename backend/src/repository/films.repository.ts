import { Inject } from '@nestjs/common';
import { Film } from 'src/films/schema/films.schema';
import { Model } from 'mongoose';
import { GetFilmDto } from '../films/dto/films.dto';

export class FilmsRepository {
    constructor(@Inject('FILM_DB') private filmModel: Model<Film>) {}

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
        const films = await this.filmModel.find({});
        const total = await this.filmModel.countDocuments({});
        return {total, items: films.map(this.getFilm())};
    }

    async findFilmById(id: string): Promise<GetFilmDto> {
        try {
            const film = await this.filmModel.findOne({ id: id });
            return film;
        } catch (error) {
            throw new Error(`Этот фильм с id ${id} не найден`);
        }
    }

    async getSessionData(filmId: string, sessionId: string): Promise<string[]> {
        try {
            const film = await this.filmModel.findOne({ id: filmId });
            const sessionIndex = film.schedule.findIndex((session) => {
                return session.id === sessionId;
            });
            return film.schedule[sessionIndex].taken;
        } catch (error) {
            throw new Error(`Сесии с id ${sessionId} не существует`);
        }
    }

    async pickUpAnEmptySeat(
        filmId: string,
        sessionId: string,
        seats: string,
    ): Promise<string[]> {
        const film = await this.filmModel.findOne({ id: filmId });
        const sessionIndex = film.schedule.findIndex((session) => {
            return session.id === sessionId;
        });
        try {
            await this.filmModel.updateOne(
                { id: filmId },
                { $push: { [`schedule.${sessionIndex.toString()}.taken`]: seats } },
            );
        return;
        } catch (error) {
            new Error('Ошибка брони места');
        }
    }
}