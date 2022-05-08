import { IsDate, IsDecimal, IsEmail, IsString } from "class-validator";

export default class UpdateAnnouncementRequestDto {

    @IsString()
    title: string;

    @IsString()
    description: string;

    @IsDecimal()
    startingPrice: number;

    @IsDate()
    deadlineDate: Date;
    
    @IsString()
    tagName: string;
}