import { IsBoolean, IsString } from 'class-validator';

export class CreateStoreDto {
  @IsString()
  name: string;

  @IsBoolean()
  isActive?: boolean = true;
}
