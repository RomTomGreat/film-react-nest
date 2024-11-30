import { Controller, Post, Body } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/order.dto';

@Controller('order')
export class OrderController {
    constructor(private readonly orderService: OrderService) {}

    @Post()
    createOrder(@Body() order: CreateOrderDto) {
        return this.orderService.bookAnOrder(order);
    }
}
