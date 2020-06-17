import { Module } from '@nestjs/common';
import { TimeService } from './time.service';

@Module({
  imports: [],
  controllers: [],
  providers: [TimeService],
  exports: [TimeService]
})
export class TimeModule {}
