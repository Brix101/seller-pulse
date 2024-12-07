import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import { ClientProvider, GrantType } from '../entities/client.entity';
import { Region } from 'src/common/constants';

export class CreateClientDto {
  @ApiProperty({
    enum: ClientProvider,
  })
  @IsEnum(ClientProvider)
  clientProvider: ClientProvider;

  @ApiProperty({
    enum: Region,
  })
  @IsEnum(Region)
  region: Region;

  @ApiProperty({
    description: 'The client ID',
    example: '1234',
  })
  @IsString()
  clientId: string;

  @ApiProperty({
    description: 'The client secret',
    example: '5678',
  })
  @IsString()
  clientSecret: string;

  @ApiProperty({
    enum: GrantType,
  })
  @IsEnum(GrantType)
  grantType: GrantType;

  @ApiProperty({
    description: 'The refresh token',
    example: '90ab',
  })
  @IsString()
  refreshToken: string;
}
