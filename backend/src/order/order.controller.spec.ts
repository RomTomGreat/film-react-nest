import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

describe('OrderController', () => {
  let controller: OrderController;
  let service: OrderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [OrderService],
    })
      .overrideProvider(OrderService)
      .useValue({
        bookAnOrder: jest.fn().mockResolvedValue({
          email: 'test@gmail.com',
          phone: '79912400777',
          tickets: [
            {
              film: '6o4fg03u-78r6-23op-0h45-7g6ro6e0j3lf',
              session: '703hw9gm-5605-5u88-g83l-p38flt9w0mx2',
              daytime: '2024-12-29T12:00:55+03:00',
              day: '2024-12-29',
              time: '12:00',
              row: 7,
              seat: 7,
              price: 350,
            },
          ],
        })
      })
      .compile();

    controller = module.get<OrderController>(OrderController);
    service = module.get<OrderService>(OrderService);
  });

  it('should be call createOrder from service', async () => {
    const order = {
      email: 'test@gmail.com',
      phone: '79912400777',
      tickets: [
        {
          film: '6o4fg03u-78r6-23op-0h45-7g6ro6e0j3lf',
          session: '703hw9gm-5605-5u88-g83l-p38flt9w0mx2',
          daytime: '2024-12-29T12:00:55+03:00',
          day: '2024-12-29',
          time: '12:00',
          row: 7,
          seat: 7,
          price: 350,
        },
      ]
    };
    const orderCreated = await controller.createOrder(order);
    expect(orderCreated).toEqual(order);
    expect(service.bookAnOrder).toHaveBeenCalledWith(order);
  });
});