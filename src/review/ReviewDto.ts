import { IsDate, IsInt, IsString } from "class-validator";

export default class ReviewDto {
    @IsString()
    id: string

    @IsString()
    clientId: string

    @IsString()
    freelancerId: string

    @IsInt()
    score: number

    @IsString()
    description: string

    @IsDate()
    creationDate: Date
 }