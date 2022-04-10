import { Column, Entity,  OneToMany,  PrimaryGeneratedColumn } from "typeorm";
import { AnnouncementTag } from "./AnnouncementTag";


@Entity("tags")
export class Tag {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column("varchar")
    name: string;
}
