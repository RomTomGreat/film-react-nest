import { HttpException, HttpStatus } from "@nestjs/common";

export class SeatOccupiedError extends HttpException {
    constructor(seats: string) {
        const row = seats.split(':')[0];
        const seat = seats.split(':')[1];
        super(`Вы пытаетесь купить место, которое уже занято: ряд ${row}, место ${seat}`, HttpStatus.BAD_REQUEST);
    }
}