import { Body, Controller, HttpCode, HttpStatus, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiParam, ApiResponse } from '@nestjs/swagger';
import { ImportReportService } from './import/import-report.service';
import { TimeService } from './time.service';

@Controller('/user/:user/project/:project/times/import')
export class TimeController {
  constructor(private timeService: TimeService, private reportService: ImportReportService) {}

  @Post('/from/times')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'user', required: true, description: 'User' })
  @ApiParam({ name: 'project', required: true, description: 'Project' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Times inserted.' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error.' })
  public insert(@Param('user') user, @Param('project') project, @Body() times: string[]) {
    return this.timeService.insertTimes(user, project, times);
  }

  @Post('/from/report')
  @ApiConsumes('multipart/form-data')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'user', required: true, description: 'User' })
  @ApiParam({ name: 'project', required: true, description: 'Project' })
  @ApiBody({
    type: 'multipart/form-data',
    required: true,
    description: 'Report csv file to import',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary'
        }
      }
    }
  })
  @ApiResponse({ status: HttpStatus.OK, description: 'Times inserted.' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error.' })
  @UseInterceptors(FileInterceptor('file'))
  public upload(@Param('user') user, @Param('project') project, @UploadedFile() file) {
    return this.reportService.parse(file.buffer.toString()).then(times => this.insert(user, project, times));
  }
}
