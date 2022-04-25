import { IsDate, IsDecimal, IsEmail, IsString } from "class-validator";

export default class UpdateAnnouncementRequestDto {

    @IsString()
    description: string;

    @IsDecimal()
    startingPrice: number;

    @IsDate()
    deadlineDate: Date;
    
    @IsString()
    tagName: string;
}