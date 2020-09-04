import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';

describe('AppController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [AppController]
    }).compile();
  });

  describe('ping', () => {
    it('should return ok', () => {
      const appController = app.get<AppController>(AppController);
      expect(appController.ping()).toEqual('Server is up!');
    });
  });
});
