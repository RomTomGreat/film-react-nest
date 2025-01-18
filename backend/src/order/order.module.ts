import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Film } from "../films/entities/film.entity";
import { Schedule } from "../films/entities/schedule.entity";
import { OrderService } from "./order.service";
import { OrderController } from "./order.controller";

@Module({
    imports: [TypeOrmModule.forFeature([Film, Schedule])],
    providers: [OrderService],
    controllers: [OrderController],
})

export class OrderModule {}