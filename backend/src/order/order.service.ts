import { SeatOccupiedError } from '../errors/seat_occupied_error';
import { NotFoundError } from '../errors/not_found_error';
import { InternalServerError } from '../errors/internal_server_error';
import { Injectable } from '@nestjs/common';
import { CreateOrderDto, GetTicketDto } from './dto/order.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Film } from '../films/entities/film.entity';

@Injectable()
export class OrderService {
    constructor(@InjectRepository(Film) private readonly filmDatabase: Repository<Film>) {}

    private async getSessionData(filmId: string, sessionId: string) {
        try {
            const film = await this.filmDatabase.findOne({
                where: { id: filmId },
                relations: { schedule: true },
            });
            const sessionIndex = film.schedule.findIndex((session) => {
                return session.id === sessionId;
            });
            return film.schedule[sessionIndex].taken;
        } catch (error) {
            throw new NotFoundError(sessionId);
        }
    }

    private async placeSeatsOrder(filmId: string, sessionId: string, seats: string) {
        const film = await this.filmDatabase.findOne({
            where: { id: filmId },
            relations: { schedule: true },
        });
        const sessionIndex = film.schedule.findIndex((session) => {
            return session.id === sessionId;
        });
        const previousData = film.schedule[sessionIndex].taken;
        let newData: string;
        if (previousData === '{}') {
            newData = `{${seats}}`;
        } else {
            newData = `${previousData.slice(0, -1)},${seats}}`;
        }
        film.schedule[sessionIndex].taken = newData;

        try {
            await this.filmDatabase.save(film);
            return;
        } catch (error) {
            new InternalServerError('Неизвестная ошибка сервера');
        }
    }

    async placeOrder(orderData: CreateOrderDto): Promise<{ items: GetTicketDto[] | null; total: number }> {
        const ticketsAvailableForPurchase = [];

        for (const ticket of orderData.tickets) {
            const sessionData = await this.getSessionData(ticket.film, ticket.session);
            console.log(sessionData);
            const seatsSelection = `${ticket.row}:${ticket.seat}`;
            if (sessionData.includes(seatsSelection)) {
                throw new SeatOccupiedError(seatsSelection);
            }

            ticketsAvailableForPurchase.push({
                filmId: ticket.film,
                sessionId: ticket.session,
                seatsSelection: seatsSelection,
            });
        }
        if (ticketsAvailableForPurchase.length > 0) {
            ticketsAvailableForPurchase.forEach((ticket) => {
                const { filmId, sessionId, seatsSelection } = ticket;
                this.placeSeatsOrder(filmId, sessionId, seatsSelection);
            });
        }

        return { items: orderData.tickets, total: orderData.tickets.length };
    }
}