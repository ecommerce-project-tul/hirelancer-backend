import { IsBoolean } from "class-validator";

export default class ChangeAnnouncementStatusRequestDto {
    @IsBoolean()
    isActive: boolean;
}