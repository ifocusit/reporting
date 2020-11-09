import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';

describe('AppController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [AppController]
    }).compile();
  });

  describe('health', () => {
    it('should return ok', () => {
      const appController = app.get<AppController>(AppController);
      expect(appController.health()).toEqual('Server is up!');
    });
  });
});
