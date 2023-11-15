import { IsInt, IsNotEmpty, } from "class-validator";

export class CreateReviewDto{
    @IsNotEmpty()
    userId: string;

    @IsNotEmpty()
    @IsInt()
    rating: number;
    
    @IsNotEmpty()
    text: string;
}