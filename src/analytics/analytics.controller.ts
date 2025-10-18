import { Controller, Get } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  /**
   * GET /analytics
   * Returns randomized analytics data with the structure:
   * - resumen: summary with total in period
   * - tramitesPorTipo: array of procedures by type
   * - tramitesPorFecha: array of procedures by date
   *
   * Each request returns the same structure with values varying by ±20-30%
   */
  @Get()
  getAnalytics() {
    return this.analyticsService.getAnalyticsData();
  }
}
