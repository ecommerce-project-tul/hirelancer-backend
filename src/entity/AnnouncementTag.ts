import { Column, Entity,  JoinColumn,  ManyToMany,  ManyToOne,  OneToOne,  PrimaryGeneratedColumn, TableCheck } from "typeorm";
import { Announcement } from "./Announcement";
import { Tag } from "./Tag";

@Entity("announcements_tags")
export class AnnouncementTag {
    @PrimaryGeneratedColumn("uuid")
    id: string;
    
    @ManyToOne(() => Announcement, announcement => announcement.tags)
    @JoinColumn({name: "announcement_id"})
    announcement: Announcement    

    @ManyToOne(() => Tag, tag => tag.id)
    @JoinColumn({name: "tag_id"})
    tag: Tag

    // @Column({type: "uuid", name: "announcement_id"})
    // announcementId: string;

    // @Column({type: "uuid", name: "tag_id"})
    // tagId: string;
}