import { Transform } from 'class-transformer';
import { IsBoolean, IsString } from 'class-validator';

export class CreateStoreDto {
  @IsString()
  name: string;

  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  isActive?: boolean = true;
}
