import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getIsRunning(): string {
    return 'API is running! 🚀';
  }
}