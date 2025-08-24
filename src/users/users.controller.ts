import { Controller, Get, Post, Body, Param, Put, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update.user.dto';
import { LoginDto } from './entities/login.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post() // MN-3: Creación de perfil de usuario
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  // MN-1: Gestión de Usuarios
  // MN-2: Login de usuario
  // MN-3: Creación de perfil de usuario
  // MN-4: Creación de perfil de especialista
  // MN-5: Login de profesional
  // MN-6: Edición de perfil de usuario
  // MN-7: Edición de perfil de profesional
  // MN-9: Obtener todos los usuarios
  @Get() // MN-9: Obtener todos los usuarios
  findAll(
    @Query('page') page = '1',
    @Query('limit') limit = '20',
  ) {
    return this.usersService.findAll(Number(page), Number(limit));
  }

  @Get(':id') // REQ: MN-4 
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @Put(':id') // MN-7: Edición de perfil de profesional
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUserDto) {
    return this.usersService.update(id, dto);
  }

  @Delete(':id') // REQ: MN-6
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }

  @Post('login') // MN-2: Login de usuario
  login(@Body() dto: LoginDto) {
    return this.usersService.login(dto);
  }
}