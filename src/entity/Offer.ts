import { Column, Entity,  JoinColumn,  ManyToOne,  OneToOne,  PrimaryGeneratedColumn } from "typeorm";
import { Announcement } from "./Announcement";
import { User } from "./User";

@Entity("offers")
export class Offer {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    // @Column({type: "uuid", name: "freelancer_id"})
    // freelancerId: string;

    @ManyToOne(() => User, user => user.offers)
    @JoinColumn({name: "freelancer_id"})
    freelancer: User;

    // @Column({type: "uuid", name: "announcement_id"})
    // announcementId: string;

    @ManyToOne(() => Announcement, announcement => announcement.offers)
    @JoinColumn({name: "announcement_id"})
    announcement: Announcement;


    @OneToOne(() => Announcement, announcement => announcement.chosenOffer)
    @JoinColumn({name: "xd_id"})
    xd: Announcement;

    @Column("decimal")
    price: number;
}