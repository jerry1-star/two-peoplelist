import { Module } from '@nestjs/common'
import { LearningRecordsService } from './learning-records.service'
import { LearningRecordsController } from './learning-records.controller'

@Module({
  controllers: [LearningRecordsController],
  providers: [LearningRecordsService],
})
export class LearningRecordsModule {}
