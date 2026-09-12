import { Controller, Get } from '@nestjs/common';
import { StatsService } from './stats.service';

@Controller()
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get(['allstats', 'allStats'])
  async getStatsCount() {
    return this.statsService.getStatsCountFromDB();
  }
}
