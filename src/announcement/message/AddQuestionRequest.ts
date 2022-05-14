import { IsBoolean, IsEmail, IsString } from 'class-validator';

export class AddQuestionRequest {
  @IsString()
  content: string;

  @IsBoolean()
  isAnonymous: boolean;

  @IsEmail()
  freelancerEmail: string;
}
