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

  /**
   * Create a new user
   * Validates email uniqueness before creating
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    // Check if email already exists
    const existingUser = await this.userRepository.findOne({
      where: { correo: createUserDto.correo },
    });

    if (existingUser) {
      throw new ConflictException(
        `El correo electrónico ${createUserDto.correo} ya está registrado`,
      );
    }

    // Create new user with default values
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

  /**
   * Find all users
   */
  async findAll(): Promise<User[]> {
    return await this.userRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Find a user by ID
   * Updates ultimaVezActivo timestamp when accessing user info
   */
  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    // Update last active timestamp
    await this.updateLastActive(id);

    return user;
  }

  /**
   * Update a user by ID
   */
  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    // Check if user exists
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    // If email is being updated, check uniqueness
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

    // Merge updates and save
    Object.assign(user, updateUserDto);
    return await this.userRepository.save(user);
  }

  /**
   * Remove a user by ID (soft delete)
   */
  async remove(id: string): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    await this.userRepository.remove(user);
  }

  /**
   * Update the last active timestamp for a user
   */
  async updateLastActive(id: string): Promise<void> {
    await this.userRepository.update(id, {
      ultimaVezActivo: new Date(),
    });
  }

  /**
   * Find a user by email
   * Useful for authentication or email lookup
   */
  async findByEmail(correo: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { correo },
    });
  }
}
