import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { CreateDateColumn, EntityNotFoundError, Repository } from 'typeorm';
import { CreateReviewDto } from './dto/create-review.dto';
import { UsersService } from '#/users/users.service';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewService {
    constructor(
        @InjectRepository(Review)
        private reviewsRepository: Repository<Review>,
        private userService: UsersService
    ){}

    findAll(){
        return this.reviewsRepository.findAndCount({relations:{user: true}});
    }

    async create(createReviewDto: CreateReviewDto){
        try {
            const findOneUserId = await this.userService.findOne(createReviewDto.userId)
            const reviewEntity = new Review
            reviewEntity.rating = createReviewDto.rating
            reviewEntity.text = createReviewDto.text
            reviewEntity.user = findOneUserId

            const insertReview = await this.reviewsRepository.insert(reviewEntity)
            return await this.reviewsRepository.findOneOrFail({
                where: {
                    id: insertReview.identifiers[0].id
                }
            })
        } catch (error) {
            return error
        }
    }

    async findOne(id:string){
        try {
            return await this.reviewsRepository.findOneOrFail({where: {id},relations: {user:true}})
        } catch (error) {
            if (error instanceof EntityNotFoundError) {
                throw new HttpException(
                    {
                        statusCode: HttpStatus.NOT_FOUND,
                        error: 'Data Not Found'
                    },
                    HttpStatus.NOT_FOUND
                )
            } else {
                throw error
            }
        }
    }

    async update(id: string, updateReviewDto: UpdateReviewDto){
        try {
         await this.findOne(id)

         const reviewEntity = new Review
            reviewEntity.rating = updateReviewDto.rating
            reviewEntity.text = updateReviewDto.text

            await this.reviewsRepository.update(id,reviewEntity)

            return this.reviewsRepository.findOneOrFail({
                where: {
                    id,
                }
            })
        } catch (error) {
            if (error instanceof EntityNotFoundError) {
                throw new HttpException(
                    {
                        statusCode: HttpStatus.NOT_FOUND,
                        error: 'Data Not Found'
                    },
                    HttpStatus.NOT_FOUND
                )
            } else {
                throw error
            }
        }
    }

    async deleteReview(id: string){
        try {
            await this.findOne(id)
            await this.reviewsRepository.softDelete(id)
            return `Delete Success`
        } catch (e) {
            throw e
        }
    }
}
