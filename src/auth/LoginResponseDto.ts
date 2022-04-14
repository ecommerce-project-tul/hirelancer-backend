import { IsNumber, IsString } from "class-validator";

export default class LoginResponseDto {
    @IsNumber()
    public expiresIn: number;

    @IsString()
    public token: string;
 }