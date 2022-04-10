import { Column, Entity,  JoinColumn,  OneToOne,  PrimaryGeneratedColumn } from "typeorm";
import { Announcement } from "./Announcement";
import { User } from "./User";

@Entity("payments")
export class Payment {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @OneToOne(type => User, user => user.id)
    @JoinColumn({
        name: "user_from_id",
    })
    userFrom: User;

    @OneToOne(type => User, user => user.id)
    @JoinColumn({
        name: "user_to_id",
    })
    userTo: User;

    @OneToOne(type => Announcement, announcement => announcement.id)
    @JoinColumn({
        name: "announcement_id",
    })
    announcment: Announcement;

    @Column("timestamp")
    date: Date;

    @Column("decimal")
    price: number;
}