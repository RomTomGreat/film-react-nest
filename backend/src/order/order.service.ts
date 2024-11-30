import { Injectable } from '@nestjs/common';
import { FilmsRepository } from 'src/repository/films.repository';
import { CreateOrderDto } from './dto/order.dto';

@Injectable()
export class OrderService {
    constructor(private readonly filmRepository: FilmsRepository) {}

    async bookAnOrder(orderData: CreateOrderDto): Promise<any> {
        const availableTicket = [];
    
        for (const order of orderData.getOrderData) {
            const sessionData = await this.filmRepository.getSessionData(order.filmId, order.sessionId);

            if (sessionData.includes(order.seatsSelection)) {
                throw new Error('Это место уже занято!');
            }
    
            availableTicket.push({
                filmId: order.filmId,
                sessionId: order.sessionId,
                seatsSelection: order.seatsSelection
            });
        }

        if (availableTicket.length > 0) {
            availableTicket.forEach((ticket) => {
                const { filmId, sessionId, seatsSelection } = ticket;
                this.filmRepository.pickUpAnEmptySeat(filmId, sessionId, seatsSelection);
            });
        }
        return orderData;
    }
}
