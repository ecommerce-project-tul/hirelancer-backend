import { Column, Entity,  ManyToMany,  PrimaryGeneratedColumn } from "typeorm";
import { Announcement } from "./Announcement";

@Entity("tags")
export class Tag {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column("varchar")
    name: string;

    @ManyToMany(() => Announcement, announcement => announcement.tags)
    announcements: Announcement[]; 
}
