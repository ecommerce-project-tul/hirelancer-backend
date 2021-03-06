import { Column, Entity,  JoinColumn,  JoinTable,  ManyToMany,  ManyToOne,  OneToMany,  OneToOne,  PrimaryGeneratedColumn, TableCheck, Timestamp } from "typeorm";
import { Offer } from "./Offer";
import { User } from "./User";
import { Message } from './Message'
import { Tag } from "./Tag";

@Entity("announcements")
export class Announcement {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ManyToOne(() => User, user => user.announcements)
    @JoinColumn({name: "client_id"})
    client: User

    // @Column({type: "uuid", name: "client_id"})
    // clientId: string;

    // @Column({type: "uuid", name: "chosen_offer_id"})
    // chosenOfferId: string

    @OneToOne(() => Offer, offer => offer.announcement, {nullable: true})
    chosenOffer: Offer;

    @OneToMany(() => Offer, offer => offer.announcement, {nullable: true})
    offers: Offer[];

    @Column("varchar")
    title: string;

    @Column('text')
    description: string;

    @Column({type: "decimal", name: "starting_name"})
    startingPrice: number;

    @Column({type: "date", name: "deadline_name"})
    deadlineDate: Date;

    @Column('timestamp', {name: "creation_date", default: new Date()})
    creationDate: Date;

    @Column({type: "boolean", name: "is_active", nullable: true, default: true})
    isActive: boolean;

    @OneToMany(() => Message, message => message.announcement, {
        nullable: true, 
        onDelete: "CASCADE"
    })
    messages: Message[];

    @ManyToMany(() => Tag, tag => tag.announcements)
    @JoinTable({ 
        name: "announcement_tags", 
        joinColumn: {
            name: "announcement_id"
        },
        inverseJoinColumn: {
            name: "tag_id"
        }
    })
    tags: Tag[]; 
}