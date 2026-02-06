import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoomDto } from './dto/create-room.dto';

@Injectable()
export class RoomsService {
  constructor(private prisma: PrismaService) {}

  async create(createRoomDto: CreateRoomDto, userId: string) {
    const room = await this.prisma.room.create({
      data: {
        name: createRoomDto.name,
        members: {
          create: {
            userId,
          },
        },
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
              },
            },
          },
        },
      },
    });

    return room;
  }

  async findAll() {
    return this.prisma.room.findMany({
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
              },
            },
          },
        },
        _count: {
          select: { messages: true },
        },
      },
    });
  }

  async findOne(id: string) {
    const room = await this.prisma.room.findUnique({
      where: { id },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
              },
            },
          },
        },
        messages: {
          take: 50,
          orderBy: { createdAt: 'desc' },
          include: {
            user: {
              select: {
                id: true,
                username: true,
              },
            },
          },
        },
      },
    });

    if (!room) {
      throw new NotFoundException('Room not found');
    }

    return {
      ...room,
      messages: room.messages.reverse(),
    };
  }

  async join(roomId: string, userId: string) {
    const existing = await this.prisma.roomMember.findUnique({
      where: {
        userId_roomId: {
          userId,
          roomId,
        },
      },
    });

    if (existing) {
      return existing;
    }

    return this.prisma.roomMember.create({
      data: {
        userId,
        roomId,
      },
    });
  }

  async leave(roomId: string, userId: string) {
    return this.prisma.roomMember.delete({
      where: {
        userId_roomId: {
          userId,
          roomId,
        },
      },
    });
  }

  async getMessages(roomId: string, limit = 50, before?: string) {
    return this.prisma.message.findMany({
      where: {
        roomId,
        ...(before && {
          createdAt: {
            lt: new Date(before),
          },
        }),
      },
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });
  }
}
