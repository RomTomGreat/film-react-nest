import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Film } from './entities/film.entity';
import { Schedule } from './entities/schedule.entity';

@Injectable()
export class FilmsService {
    constructor(@InjectRepository(Film) private filmRepository: Repository<Film>) {}

    async findAll(): Promise<{ items: Film[]; total: number }> {
        const [items, total] = await Promise.all([
            this.filmRepository.find({ relations: { schedule: true } }),
            this.filmRepository.count()
        ]);
        return { items, total };
    }

    async findById(id: string): Promise<{ items: Schedule[], total: number }> {
        const result = await this.filmRepository.findOne({
            where: { id: id },
            relations: { schedule: true }
        });
        return { items: result.schedule, total: result.schedule.length };
    }
}