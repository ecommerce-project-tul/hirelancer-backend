import { IsEmail, IsEnum, IsOptional, IsString } from "class-validator";
import { EUserRole } from "../enum/EUserRole";

export default class UpdateUserDto {

    @IsString()
    @IsOptional()
    firstName?: string;

    @IsString()
    @IsOptional()
    lastName?: string;

    @IsString()
    @IsOptional()
    photo?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsOptional()
    githubLink?: string;

    @IsString()
    @IsOptional()
    linkedInLink?: string;
 }