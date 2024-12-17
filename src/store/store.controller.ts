import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ClientService } from 'src/client/client.service';
import { MarketplaceService } from 'src/marketplace/marketplace.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { StoreService } from './store.service';

@Controller('store')
export class StoreController {
  constructor(
    private readonly storeService: StoreService,
    private readonly marketplaceService: MarketplaceService,
    private readonly clientService: ClientService,
  ) {}

  @Post()
  create(@Body() createStoreDto: CreateStoreDto) {
    return this.storeService.create(createStoreDto);
  }

  @Get()
  findAll() {
    return this.storeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.storeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStoreDto: UpdateStoreDto) {
    return this.storeService.update(+id, updateStoreDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.storeService.remove(+id);
  }

  @Get(':id/marketplaces')
  findAllMarketplaces(@Param('id') id: string) {
    return this.marketplaceService.findAllByStoreId(+id);
  }

  @Get(':id/clients')
  findAllClients(@Param('id') id: string) {
    return this.clientService.findAllbyStoreId(+id);
  }
}
