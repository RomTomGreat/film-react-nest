import {
    IsDate,
    IsNumber,
    IsString,
    IsFQDN,
    IsNotEmpty
} from 'class-validator';

export interface GetScheduleDto {
    id: string;
    daytime: string;
    hall: number;
    rows: number;
    seats: number;
    price: number;
    taken: string[];
}

export interface GetFilmDto {
    id: string;
    rating: number;
    director: string;
    tags: string[];
    image: string;
    cover: string;
    title: string;
    about: string;
    description: string;
    schedule: GetScheduleDto[];
}

export class CreateScheduleDto {
    @IsDate()
    daytime: string;
    @IsNumber()
    hall: number;
    @IsNumber()
    rows: number;
    @IsNumber()
    seats: number;
    @IsNumber()
    price: number;
    taken: string[];
}

export class CreateFilmDto {
    @IsNumber()
    readonly rating: number;
    @IsString()
    readonly director: string;
    @IsString()
    readonly tags: string[];
    @IsFQDN()
    readonly image: string;
    @IsFQDN()
    readonly cover: string;
    @IsString()
    readonly title: string;
    @IsString()
    readonly about: string;
    @IsString()
    readonly description: string;
    @IsNotEmpty()
    readonly schedule: string[];
}
