import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  IsEnum,
  IsBoolean,
  IsOptional,
} from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class CreateUserDto {
  @ApiProperty({
    description: 'Email address of the user',
    example: 'usuario@ejemplo.com',
  })
  @IsEmail({}, { message: 'Debe proporcionar un correo electrónico válido' })
  @IsNotEmpty({ message: 'El correo electrónico es obligatorio' })
  correo: string;

  @ApiProperty({
    description: 'Full name of the user',
    example: 'Juan Pérez',
    minLength: 2,
    maxLength: 100,
  })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
  @MaxLength(100, { message: 'El nombre no puede exceder 100 caracteres' })
  nombre: string;

  @ApiProperty({
    description: 'User role in the system',
    enum: UserRole,
    example: UserRole.USER,
    default: UserRole.USER,
  })
  @IsEnum(UserRole, {
    message: 'El rol debe ser uno de: admin, user, moderator',
  })
  @IsOptional()
  rol?: UserRole;

  @ApiProperty({
    description: 'User availability status',
    example: true,
    default: true,
    required: false,
  })
  @IsBoolean({ message: 'La disponibilidad debe ser un valor booleano' })
  @IsOptional()
  disponibilidad?: boolean;
}
