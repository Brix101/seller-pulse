import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
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
  @Transform(({ value }) => value === 'true')
  isActive?: boolean = true;
}
