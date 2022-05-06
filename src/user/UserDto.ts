import { IsEmail, IsEnum, IsOptional, IsString } from "class-validator";
import { EUserRole } from "./EUserRole";

export default class UserDto {
    @IsEmail()
    email: string;
    
    @IsString()
    firstName: string;

    @IsString()
    lastName: string;

    @IsEnum(EUserRole)
    role: EUserRole;

    @IsString()
    @IsOptional()
    photo?: string;

    @IsString()
    @IsOptional()
    linkedInToken?: string;

    @IsString()
    @IsOptional()
    githubLink?: string;

    @IsString()
    @IsOptional()
    linkedInLink?: string;
    
    @IsString()
    @IsOptional()
    description?: string;
    
    @IsOptional()
    reviews?: any[]

    @IsOptional()
    announcements: any[]

    @IsOptional()
    offers: any[]

    @IsOptional()
    userTechnologyStacks: any[]
 }