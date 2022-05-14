import { IsEmail, IsString } from 'class-validator';

export class AddAnswerRequest {
  @IsString()
  content: string;

  @IsEmail()
  clientEmail: string;
}
