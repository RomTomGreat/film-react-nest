import { Test, TestingModule } from '@nestjs/testing';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';

describe('FilmsController', () => {
  let controller: FilmsController;
  let service: FilmsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilmsController],
      providers: [FilmsService]
    })
      .overrideProvider(FilmsService)
      .useValue({
        findAll: jest.fn().mockResolvedValue([{ id: 'test id' }, { id: 'again test id'}]),
        findById: jest.fn().mockResolvedValue({ id: 'test alone id' })
      })
      .compile();
      
    controller = module.get<FilmsController>(FilmsController);
    service = module.get<FilmsService>(FilmsService);
  });

  it('should be call findAll() from service', async () => {
    const films = await controller.getFilms();
    expect(films).toEqual([{ id: 'test id' }, { id: 'again test id'}]);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should be call findById() from service', async () => {
    const id = 'test incorrect id';
    const film = await controller.getFilmSchedule(id);
    expect(film).toEqual({ id: 'test alone id' });
    expect(service.findById).toHaveBeenCalledWith(id);
  });
});
