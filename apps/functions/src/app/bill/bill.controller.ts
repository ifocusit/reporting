import { Controller, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BillService } from './bill.service';

@Controller('/user/:user/project/:project/bill')
@ApiTags('Bill')
export class BillController {
  constructor(private billService: BillService) {}

  @Get('/:date')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'user', required: true, description: 'User', example: '26nyWKtW2ISZHIU5bZ6kHn7JISf1' })
  @ApiParam({ name: 'project', required: true, description: 'Project', example: 'Default' })
  @ApiParam({ name: 'date', required: true, description: 'Month or Year', example: '2020-07' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Bill(s) found.' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error.' })
  public getBill(@Param('user') user: string, @Param('project') project: string, @Param('date') date: string) {
    return this.billService.bills(user, project, date);
  }

  @Post('/:date/freeze')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'user', required: true, description: 'User', example: '26nyWKtW2ISZHIU5bZ6kHn7JISf1' })
  @ApiParam({ name: 'project', required: true, description: 'Project', example: 'Default' })
  @ApiParam({ name: 'date', required: true, description: 'Month or Year', example: '2020' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Bill feezed.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Bill not found.' })
  @ApiResponse({ status: HttpStatus.UNPROCESSABLE_ENTITY, description: 'Bill cannot be feezed.' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error.' })
  public freeze(@Param('user') user: string, @Param('project') project: string, @Param('date') date: string) {
    return this.billService.freeze(user, project, date);
  }
}
