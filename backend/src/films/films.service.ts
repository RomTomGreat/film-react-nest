import { Injectable } from '@nestjs/common';
import { FilmsRepository } from 'src/repository/films.repository';
import { GetFilmDto } from './dto/films.dto';

@Injectable()
export class FilmsService {
    constructor(private readonly filmRepository: FilmsRepository) {}

    async findAll() {
        return this.filmRepository.findAllFilms();
    }

    async findById(id: string): Promise<GetFilmDto> {
        return this.filmRepository.findFilmById(id);
    }
}
