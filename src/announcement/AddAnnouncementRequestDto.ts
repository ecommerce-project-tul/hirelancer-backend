import { IsDateString, IsEmail, IsNumber, IsString } from "class-validator";

export default class AddAnnouncementRequestDto {
    @IsEmail()
    email: string;

    @IsString()
    description: string;

    @IsNumber()
    startingPrice: number;

    @IsDateString()
    deadlineDate: Date;
    
    @IsString()
    tagName: string;
 }