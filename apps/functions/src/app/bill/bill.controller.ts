import { Controller, Param, Post, Request } from '@nestjs/common';
import { ApiParam } from '@nestjs/swagger';

@Controller('bill')
export class BillController {
  @Post('/:month/freeze')
  @ApiParam({ name: 'month', description: 'Month' })
  public freeze(@Request() req, @Param('month') month) {
    return `bill of month ${month} freezed!`;
  }
}
