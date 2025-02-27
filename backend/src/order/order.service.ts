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
    constructor(@InjectRepository(Film) private readonly filmRepository: Repository<Film>) {}
    
    private async getSessionData(filmId: string, sessionId: string) {
        try {
            const film = await this.filmRepository.findOne({
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
        const film = await this.filmRepository.findOne({
            where: { id: filmId },
            relations: { schedule: true },
        });
        if (!film) {
            throw new NotFoundError(filmId);
        }
        
        const sessionIndex = film.schedule.findIndex((session) => {
            return session.id === sessionId;
        });
        if (sessionIndex === -1) {
            throw new NotFoundError(sessionId);
        }
        const previousData = film.schedule[sessionIndex].taken;
        let newData: string;
        if (previousData === '{}') {
            newData = `{${seats}}`;
        } else {
            newData = `${previousData.slice(0, -1)},${seats}`;
        }
        film.schedule[sessionIndex].taken = newData;
    
        try {
            await this.filmRepository.save(film);
            return;
        } catch (error) {
            throw new InternalServerError('Неизвестная ошибка сервера');
        }
    }

    async bookAnOrder(orderData: CreateOrderDto): Promise<{ items: GetTicketDto[] | null; total: number }> {
        if (!Array.isArray(orderData.tickets)) {
            throw new InternalServerError('Билет должен быть массивом');
        }
        const availableTicket = [];
        for (const order of orderData.tickets) {
            const sessionData = await this.getSessionData(order.film, order.session);
            const seatPoint = `${order.row}:${order.seat}`;
            if (sessionData.includes(seatPoint)) {
                throw new SeatOccupiedError(seatPoint);
            }
            availableTicket.push({filmId: order.film, sessionId: order.session, seatPoint: seatPoint});
        }
        if (availableTicket.length > 0) {
            await Promise.all(availableTicket.map(ticket => {
                const { filmId, sessionId, seatPoint } = ticket;
                return this.placeSeatsOrder(filmId, sessionId, seatPoint);
            }));
        }
        return { items: orderData.tickets, total: orderData.tickets.length };
    }
}