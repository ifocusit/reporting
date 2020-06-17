import { Controller, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { ApiParam, ApiResponse } from '@nestjs/swagger';
import { BillService } from './bill.service';

@Controller('/user/:user/project/:project/bill')
export class BillController {
  constructor(private billService: BillService) {}

  @Post('/:month/freeze')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'user', description: 'User' })
  @ApiParam({ name: 'project', description: 'Project' })
  @ApiParam({ name: 'month', description: 'Month' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Bill feezed.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Bill not found.' })
  @ApiResponse({ status: HttpStatus.UNPROCESSABLE_ENTITY, description: 'Bill cannot be feezed.' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error.' })
  public freeze(@Param('user') user, @Param('project') project, @Param('month') month) {
    return this.billService.freeze(user, project, month);
  }
}
