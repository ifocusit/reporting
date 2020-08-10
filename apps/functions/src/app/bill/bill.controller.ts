import { Controller, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { ApiParam, ApiResponse } from '@nestjs/swagger';
import { BillService } from './bill.service';

@Controller('/user/:user/project/:project/bill')
export class BillController {
  constructor(private billService: BillService) {}

  @Post('/:date/freeze')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'user', required: true, description: 'User' })
  @ApiParam({ name: 'project', required: true, description: 'Project' })
  @ApiParam({ name: 'date', required: true, description: 'Month or Year' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Bill feezed.' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error.' })
  public freeze(@Param('user') user, @Param('project') project, @Param('date') date) {
    return this.billService.freeze(user, project, date);
  }
}
