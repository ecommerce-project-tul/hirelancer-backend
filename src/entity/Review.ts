import { Column, Entity,  JoinColumn,  ManyToOne,  OneToOne,  PrimaryGeneratedColumn, RelationId } from "typeorm";
import { User } from "./User";

@Entity("reviews")
export class Review {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ManyToOne(() => User, user => user.reviews)
    @JoinColumn({name: "client_id"})
    client: User

    @ManyToOne(() => User, user => user.reviews)
    @JoinColumn({name: "freelancer_id"})
    freelancer: User    

    // @JoinColumn({name: "freelancer_id"})
    // freelancer: string;

    @Column("int")
    score: number;

    @Column("text")
    description: string;

    @Column({type: "timestamp", name: "creation_date"})
    creationDate: Date;

}