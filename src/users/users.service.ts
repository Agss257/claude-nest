import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserRole } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: { correo: createUserDto.correo },
    });

    if (existingUser) {
      throw new ConflictException(
        `El correo electrónico ${createUserDto.correo} ya está registrado`,
      );
    }

    const user = this.userRepository.create({
      ...createUserDto,
      rol: createUserDto.rol || UserRole.USER,
      disponibilidad:
        createUserDto.disponibilidad !== undefined
          ? createUserDto.disponibilidad
          : true,
      ultimaVezActivo: new Date(),
    });

    return await this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    await this.updateLastActive(id);

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    if (updateUserDto.correo && updateUserDto.correo !== user.correo) {
      const existingUser = await this.userRepository.findOne({
        where: { correo: updateUserDto.correo },
      });

      if (existingUser) {
        throw new ConflictException(
          `El correo electrónico ${updateUserDto.correo} ya está registrado`,
        );
      }
    }

    Object.assign(user, updateUserDto);
    return await this.userRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    await this.userRepository.remove(user);
  }

  async updateLastActive(id: string): Promise<void> {
    await this.userRepository.update(id, {
      ultimaVezActivo: new Date(),
    });
  }

  async findByEmail(correo: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { correo },
    });
  }
}
