import { IsEmail, IsString } from "class-validator";

export default class LoginRequestDto {
    @IsEmail()
    email: string;
    
    @IsString()
    password: string;
 }