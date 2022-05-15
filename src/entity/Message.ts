import { Column, Entity,  JoinColumn, OneToOne, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Announcement } from "./Announcement";
import { EMessageType } from "../enum/EMessageType";
import { User } from "./User";

@Entity("messages")
export class Message {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ManyToOne(() => Announcement, announcement => announcement.messages, {
        nullable: false,
        onDelete: "CASCADE"
    })
    @JoinColumn({name: "announcement_id"})
    announcement: Announcement

    @OneToOne(() => Message, message => message.id, {
        cascade: true,
    })
    @JoinColumn({name: "message_id"})
    parent?: Message;

    @ManyToOne(()=> User, user => user.messages)
    @JoinColumn({name: "user_id"})
    user: User;

    @Column("text")
    content: string;

    @Column({type: "boolean", name: "is_anonymous"})
    isAnonymous: boolean;

    @Column({type:"enum", enum: EMessageType,  name: "message_type"})
    messageType: EMessageType

}