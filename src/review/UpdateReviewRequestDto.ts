import { IsDate, IsInt, IsOptional, IsString, Min, Max } from "class-validator";

export default class UpdateReviewRequestDto {
    @IsOptional()
    @IsInt()
    @Min(0)
    @Max(10)
    score?: number

    @IsOptional()
    @IsString()
    description?: string
 }