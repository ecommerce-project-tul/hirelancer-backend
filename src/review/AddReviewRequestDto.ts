import { IsDate, IsInt, IsString, Min, Max } from "class-validator";

export default class AddReviewRequestDto {
    @IsString()
    clientId: string

    @IsInt()
    @Min(0)
    @Max(10)
    score: number

    @IsString()
    description: string
 }