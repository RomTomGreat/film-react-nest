import { Inject, Injectable } from '@nestjs/common';
import { AppConfig } from '../app.config.provider';
import { FilmsRepositoryMongo } from '../repository/films.repository_Mongo';
import { FilmsRepositoryPostgres } from '../repository/films.repository_Postgres';
import { CreateOrderDto } from './dto/order.dto';
import { SeatOccupiedError } from '../errors/seat_occupied_error';

@Injectable()
export class OrderService {
    constructor(@Inject('CONFIG') private readonly config: AppConfig, private readonly filmRepositoryMongo: FilmsRepositoryMongo, private readonly filmRepositoryPostgres: FilmsRepositoryPostgres) {}
    
    async bookAnOrder(orderData: CreateOrderDto): Promise<any> {
        const availableTicket = [];
        const repository = this.config.database.driver === 'mongodb' ? this.filmRepositoryMongo : this.filmRepositoryPostgres;
        for (const order of orderData.getOrderData) {
                    const sessionData = await repository.getSessionData(
                        order.filmId,
                        order.sessionId,
                    );
                    if (sessionData.includes(order.seatsSelection)) {
                        throw new SeatOccupiedError(order.seatsSelection);
                    }
                    availableTicket.push({
                        filmId: order.filmId,
                        sessionId: order.sessionId,
                        seatsSelection: order.seatsSelection,
                    });
                }
                if (availableTicket.length > 0) {
                    availableTicket.forEach((ticket) => {
                        const { filmId, sessionId, seatsSelection } = ticket;
                        repository.pickUpAnEmptySeat(
                            filmId,
                            sessionId,
                            seatsSelection,
                        );
                    });
                }
        return orderData;
    }
}
