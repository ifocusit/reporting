import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('Health')
export class AppController {
  constructor() {}

  @Get('health')
  public health() {
    return 'Server is up!';
  }
}
