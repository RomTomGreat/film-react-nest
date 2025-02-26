import { IsString, IsNumber, IsArray, IsEmail, IsPhoneNumber } from 'class-validator';

export class GetTicketDto {
    @IsString()
    film: string;
    @IsString()
    session: string;
    @IsString()
    daytime: string;
    @IsString()
    day: string;
    @IsString()
    time: string;
    @IsNumber()
    row: number;
    @IsNumber()
    seat: number;
    @IsNumber()
    price: number;
}

class ContactsDto {
    @IsEmail()
    email: string;
    @IsPhoneNumber()
    phone: string;
}

export class CreateOrderDto extends ContactsDto {
    @IsArray()
    tickets: GetTicketDto[];
}