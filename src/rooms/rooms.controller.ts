import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
  Request,
  Delete,
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('rooms')
@UseGuards(JwtAuthGuard)
export class RoomsController {
  constructor(private roomsService: RoomsService) {}

  @Post()
  create(@Body() createRoomDto: CreateRoomDto, @Request() req) {
    return this.roomsService.create(createRoomDto, req.user.userId);
  }

  @Get()
  findAll() {
    return this.roomsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roomsService.findOne(id);
  }

  @Post(':id/join')
  join(@Param('id') id: string, @Request() req) {
    return this.roomsService.join(id, req.user.userId);
  }

  @Delete(':id/leave')
  leave(@Param('id') id: string, @Request() req) {
    return this.roomsService.leave(id, req.user.userId);
  }

  @Get(':id/messages')
  getMessages(@Param('id') id: string) {
    return this.roomsService.getMessages(id);
  }
}
