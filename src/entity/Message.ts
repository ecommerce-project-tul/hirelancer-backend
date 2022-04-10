import { Column, Entity,  JoinColumn,  OneToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Announcement } from "./Announcement";
import { EMessageType } from "./enum/EMessageType";

@Entity("messages")
export class Message {
    @PrimaryGeneratedColumn("uuid")
    id: string;


    @ManyToOne(() => Announcement, announcement => announcement.messages)
    @JoinColumn({name: "announcement_id"})
    announcement: Announcement

    // @Column({type: "uuid", name: "announcement_id"})
    // announcementId: string;

    @OneToMany(() => Message, message => message.id)
    @JoinColumn({name: "message_id"})
    message?: Message;

    @Column({type: "uuid", name: "message_id", nullable: true})
    messageId?: string;

    @Column("text")
    content: string;

    @Column({type: "boolean", name: "is_anonymous"})
    isAnonymous: boolean;

    @Column({type:"enum", enum: EMessageType,  name: "message_type"})
    messageType: EMessageType

}