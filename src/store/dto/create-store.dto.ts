import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString } from 'class-validator';

export class CreateStoreDto {
  @ApiProperty({
    description: 'The name of the store',
    example: 'DStore',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The status of the store',
    example: 'true',
    default: true,
    required: false,
  })
  @IsBoolean()
  isActive?: boolean = true;
}
