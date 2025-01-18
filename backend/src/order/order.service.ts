import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Film } from '../films/entities/film.entity';
import { Repository } from 'typeorm';
import { CreateOrderDto, GetTicketDto } from './dto/order.dto';
import { SeatOccupiedError } from '../errors/seat_occupied_error';
import { NotFoundError } from '../errors/not_found_error';
import { InternalServerError } from '../errors/internal_server_error';

@Injectable()
export class OrderService {
    constructor(@InjectRepository(Film) private filmRepository: Repository<Film>) {}
    
    private async getSessionData(id: string, sessionId: string) {
        try {
            const film = await this.filmRepository.findOne({
                where: { id: id },
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

    private async placeSeatsOrder(id: string, sessionId: string, seats: string) {
        const film = await this.filmRepository.findOne({
            where: { id: id },
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
            await this.filmRepository.save(film);
            return;
        } catch (error) {
            new InternalServerError('Неизвестная ошибка сервера');
        }
    }

    async bookAnOrder(orderData: CreateOrderDto): Promise<{ items: GetTicketDto[] | null, total: number }> {
        const availableTicket = [];
        for (const order of orderData.tickets) {
            const sessionData = await this.getSessionData(order.film, order.session);
            const seatPoint = `${order.row}:${order.seat}`;
            if (sessionData.includes(seatPoint)) {
                throw new SeatOccupiedError(seatPoint);
            }
            availableTicket.push({id: order.film, sessionId: order.session, seatPoint: seatPoint});
        }
        if (availableTicket.length > 0) {
            availableTicket.forEach((ticket) => {
                const { id, sessionId, seatPoint } = ticket;
                this.placeSeatsOrder(id, sessionId, seatPoint);
            });
        }
        return { items: orderData.tickets, total: orderData.tickets.length };
    }
}