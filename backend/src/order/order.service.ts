import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Film } from '../films/entities/film.entity';
import { CreateOrderDto, GetTicketDto } from './dto/order.dto';
import { SeatOccupiedError } from '../errors/seat_occupied_error';
import { NotFoundError } from '../errors/not_found_error';
import { InternalServerError } from '../errors/internal_server_error';

@Injectable()
export class OrderService {
    constructor(@InjectRepository(Film) private filmRepository: Repository<Film>) {}

    async getSessionData(film: string, session: string) {
        try {
            const films = await this.filmRepository.findOne({
                where: { id: film },
                relations: { schedule: true },
            });
            const sessionIndex = films.schedule.findIndex((sessions) => {
                return sessions.id === session;
            });
            return films.schedule[sessionIndex].taken;
        } catch (error) {
            throw new NotFoundError(`Сеанс с id ${session} не существует`);
        }
    }

    async placeSeatsOrder(film: string, session: string, seats: string) {
        const films = await this.filmRepository.findOne({
            where: { id: film },
            relations: { schedule: true },
        });
        const sessionIndex = films.schedule.findIndex((sessions) => {
            return sessions.id === session;
        });
        const previousData = films.schedule[sessionIndex].taken;
        const newData = previousData.concat(seats);
        films.schedule[sessionIndex].taken = newData;

        try {
            await this.filmRepository.save(films);
            return;
        } catch (error) {
            new InternalServerError('Неизвестная ошибка сервера');
        }
    }

    async bookAnOrder(orderData: CreateOrderDto): Promise<{ items: GetTicketDto[] | null; total: number }> {
        const availableTicket = [];

        for (const ticket of orderData.tickets) {
            const sessionData = await this.getSessionData(ticket.film, ticket.session);
            console.log(sessionData);
            const seatsSelection = `${ticket.row}:${ticket.seat}`;
            if (sessionData.includes(seatsSelection)) {
                throw new SeatOccupiedError(seatsSelection);
            }

            availableTicket.push({
                film: ticket.film,
                session: ticket.session,
                seatsSelection: seatsSelection,
            });
        }
        if (availableTicket.length > 0) {
            availableTicket.forEach((ticket) => {
                const { film, session, seatsSelection } = ticket;
                this.placeSeatsOrder(film, session, seatsSelection);
            });
        }

        return { items: orderData.tickets, total: orderData.tickets.length };
    }
}