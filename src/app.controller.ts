import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): Object {
    return { 
      Id : 1,
      nombre_usuarios: "Yorman",
      password: "1234"
    }
  }
}
