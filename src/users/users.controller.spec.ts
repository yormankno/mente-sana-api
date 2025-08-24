import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';

// MN-1: Gestión de Usuarios
// MN-2: Login de usuario
// MN-3: Creación de perfil de usuario
// MN-4: Creación de perfil de especialista
// MN-5: Login de profesional
// MN-6: Edición de perfil de usuario
// MN-7: Edición de perfil de profesional
// MN-9: Obtener todos los usuarios
// MN-10: Notificaciones
// MN-11: Recordatorio hidratación
// MN-12: Recordatorio actividad social
// MN-13: Recordatorio ejercicios de relajación
// MN-14: Recordatorio descanso
// MN-15: Recordatorio descanso ocular
// MN-16: Consejos de autocuidado
// MN-17: Frases motivacionales
// MN-18: Crear notificaciones
// MN-19: Editar notificaciones
// MN-20: Borrar notificaciones
// MN-21: Listar notificaciones

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
