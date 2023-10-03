import { IS_NOT_EMPTY, IsAlphanumeric, IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ChatRoomBody {
    id: number;
    message: string;
    @IsString()
    @IsNotEmpty()
    name?: string;
    isPrivate?: boolean;
    isDm?: boolean;
    @IsNumber()
    @IsNotEmpty()
    password?: string;
    receiver: number;
}
