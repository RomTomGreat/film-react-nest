import { Controller, Get, Param } from '@nestjs/common';
import { FilmsService } from './films.service';

@Controller('films')
export class FilmsController {
    constructor(private readonly filmService: FilmsService) {}

    @Get()
    getFilms() {
        return this.filmService.findAll();
    }

    @Get(':id/schedule')
    getFilmSchedule(@Param('id') id: string) {
        return this.filmService.findById(id);
    }
}
