import { IsEmail, IsEnum, IsString } from "class-validator";
import { EUserRole } from "../enum/EUserRole";

export default class RegistrationRequestDto {
    @IsEmail()
    email: string;
    
    @IsString()
    password: string;

    @IsString()
    firstName: string;

    @IsString()
    lastName: string;

    @IsEnum(EUserRole)
    role: EUserRole;
 }