import { Module } from '@nestjs/common';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { UsersService } from '#/users/users.service';
import { UsersModule } from '#/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Review]), UsersModule],
  controllers: [ReviewController],
  providers: [ReviewService]
})
export class ReviewModule {}
