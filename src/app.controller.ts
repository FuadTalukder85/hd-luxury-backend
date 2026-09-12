import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHealthCheck() {
    return {
      message: 'Server is running smoothly',
      timestamp: new Date(),
    };
  }
}
