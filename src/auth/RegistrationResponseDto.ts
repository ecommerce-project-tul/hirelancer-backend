import { IsString } from "class-validator";

export default class RegistrationResponseDto {
    @IsString()
    public message: string;

    @IsString()
    public userId: string;
 }