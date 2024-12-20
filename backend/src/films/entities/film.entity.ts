import { IsArray, IsNumber, IsString, Max, Min } from "class-validator";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Schedule } from "./schedule.entity";

@Entity()
export class Film {
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    @IsString()
    title: string;

    @Column()
    @IsString()
    director: string;

    @Column()
    @IsNumber()
    @Min(0)
    @Max(10)
    rating: number;

    @Column('text', { array: true })
    @IsArray()
    tags: string[];

    @Column()
    @IsString()
    image: string;

    @Column()
    @IsString()
    cover: string;

    @Column()
    @IsString()
    about: string;

    @Column()
    @IsString()
    description: string;

    @OneToMany(() => Schedule, (schedule) => schedule.film, { cascade: true })
    schedule: Schedule[];
}