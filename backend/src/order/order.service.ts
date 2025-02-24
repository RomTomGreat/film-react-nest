import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Film } from '../films/entities/film.entity';
import { CreateOrderDto, GetTicketDto } from './dto/order.dto';
import { SeatOccupiedError } from '../errors/seat_occupied_error';
import { NotFoundError } from '../errors/not_found_error';
import { Schedule } from '../films/entities/schedule.entity';

@Injectable()
export class OrderService {
    constructor(@InjectRepository(Film) private readonly filmRepository: Repository<Film>, @InjectRepository(Schedule) private readonly scheduleRepository: Repository<Schedule>) {}

    async placeSeatsOrder(filmId: string, sessionId: string, seats: string[]) {
        const film = await this.filmRepository.findOne({
            where: { id: filmId }, 
            relations: { schedule: true },
        });

        if (!film) {
            throw new NotFoundError('Фильм не найден');
        }

        const schedule = film.schedule.find((scheduleId) => scheduleId.id === sessionId); 

        if (!schedule) {
            throw new NotFoundError('Сеанс не найден');
        }

        const seatsSelection = new Set(schedule.taken || []);

        for (const seat of seats) {
            if (seatsSelection.has(seat)) {
                throw new SeatOccupiedError(`Место ${seat} уже занято`);
            }
            seatsSelection.add(seat);
        }

        schedule.taken = Array.from(seatsSelection);

        await this.scheduleRepository.save(schedule);
    }

    async bookAnOrder(order: CreateOrderDto): Promise<{ items: GetTicketDto[] | null; total: number }> {
        const availableTicket = [];

        for (const ticket of order.tickets) {
            const filmId = ticket.film; 
            const sessionId = ticket.session; 

            await this.placeSeatsOrder(filmId, sessionId, [`${ticket.row}:${ticket.seat}`]);

            availableTicket.push({
                film: ticket.film,
                session: ticket.session,
                daytime: new Date().toISOString(),
                day: ticket.day,
                time: ticket.time,
                row: ticket.row,
                seat: ticket.seat,
                price: ticket.price
            });
        }

        return {items: order.tickets, total: order.tickets.length};
    }
}