import { IsString, IsNumber, IsArray, IsEmail, IsPhoneNumber, IsNotEmpty } from 'class-validator';

export class GetTicketDto {
    @IsString()
    @IsNotEmpty()
    film: string;
    @IsString()
    @IsNotEmpty()
    session: string;
    @IsString()
    @IsNotEmpty()
    daytime: string;
    @IsString()
    @IsNotEmpty()
    day: string;
    @IsString()
    @IsNotEmpty()
    time: string;
    @IsNumber()
    @IsNotEmpty()
    row: number;
    @IsNumber()
    @IsNotEmpty()
    seat: number;
    @IsNumber()
    @IsNotEmpty()
    price: number;
}

class ContactsDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;
    @IsPhoneNumber()
    @IsNotEmpty()
    phone: string;
}

export class CreateOrderDto extends ContactsDto {
    @IsArray()
    tickets: GetTicketDto[];
}