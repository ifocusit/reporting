import { Controller, Get, HttpCode, HttpStatus, Param, Post, Res } from '@nestjs/common';
import { ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { Readable } from 'stream';
import { BillService } from './bill.service';

@Controller('/users/:user/projects/:project/bills')
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

  @Get('/:month/merge')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'user', required: true, description: 'User', example: '26nyWKtW2ISZHIU5bZ6kHn7JISf1' })
  @ApiParam({ name: 'project', required: true, description: 'Project', example: 'Default' })
  @ApiParam({ name: 'month', required: true, description: 'Month', example: '2020-07' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Pdf of the bill with attachments.',
    content: { 'application/pdf': { schema: { type: 'file', format: 'binary' } } }
  })
  @ApiResponse({ status: HttpStatus.UNPROCESSABLE_ENTITY, description: 'Bill not archived.' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error.' })
  @HttpCode(HttpStatus.OK)
  public getMergedBill(
    @Res() res: Response,
    @Param('user') user: string,
    @Param('project') project: string,
    @Param('month') month: string
  ) {
    return this.billService
      .mergeBill(user, project, month)
      .then(doc => doc.save())
      .then(pdfBytes => Buffer.from(pdfBytes))
      .then(buffer => {
        const stream = new Readable();
        stream.push(buffer);
        stream.push(null);
        res.set({
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename=${month}.pdf`,
          'Content-Length': buffer.length
        });

        stream.pipe(res);
      });
  }
}
