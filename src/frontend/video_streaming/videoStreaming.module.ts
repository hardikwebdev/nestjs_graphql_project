import { Module } from '@nestjs/common';
import { FrontEndVideoStreamingService } from './videoStreaming.service';
import { DatabaseModule } from 'src/database/database.module';
import { FrontEndVideoStreamingResolver } from './videoStreaming.resolver';

@Module({
  providers: [FrontEndVideoStreamingService, FrontEndVideoStreamingResolver],
  imports: [DatabaseModule],
})
export class FrontEndVideoStreamingModule {}
