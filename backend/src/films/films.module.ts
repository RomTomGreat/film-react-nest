import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Film } from "./entities/film.entity";
import { Schedule } from "./entities/schedule.entity";
import { FilmsService } from "./films.service";
import { FilmsController } from "./films.controller";

@Module({
    imports: [TypeOrmModule.forFeature([Film, Schedule])],
    providers: [FilmsService],
    controllers: [FilmsController],
})

export class FilmsModule {}