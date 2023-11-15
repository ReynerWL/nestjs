import {
    Controller,
    Get,
    Post,
    Body,
    Put,
    Param,
    Delete,
    ParseUUIDPipe,
    HttpStatus,
  } from '@nestjs/common';
import { ReviewService } from './review.service';
import { HttpStatusCode } from 'axios';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Controller('review')
export class ReviewController {
    constructor(
        private reviewService: ReviewService
    ){}

    @Get()
     async getFindAll(){
       const [data, count] = await this.reviewService.findAll()

       return{
        data,
        count,
        statusCode: HttpStatus.OK,
        message: "success"
       }
     }
 
    @Post()
    async create(@Body() createReviewDto: CreateReviewDto){
        const data = await this.reviewService.create(createReviewDto)

        return{
            data,
            statusCode: HttpStatus.CREATED,
            message: "success"
        }
    }

    @Get('/:id')
     async getDetailById(@Param('id', ParseUUIDPipe) id:string){
      return {
        data: await this.reviewService.findOne(id),
        statusCode: HttpStatus.OK,
        message: "success"
      }
    }
    
    @Put('/:id')
    async update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateReviewDto: UpdateReviewDto
    ){
        return {
            data: await this.reviewService.update(id, updateReviewDto),
            statusCode: HttpStatus.OK,
            message: "success"
        }
    }

    @Delete('/:id')
    async deleteReview(
     @Param('id', ParseUUIDPipe ) id: string
    ){
       return {
        statusCode : HttpStatus.OK,
        message: await this.reviewService.deleteReview(id)
       }
    }
}
