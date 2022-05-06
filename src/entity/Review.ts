import { Column, Entity,  JoinColumn,  ManyToOne,  OneToOne,  PrimaryGeneratedColumn, RelationId } from "typeorm";
import { User } from "./User";

@Entity("reviews")
export class Review {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ManyToOne(() => User, user => user.reviews, {nullable: false})
    @JoinColumn({name: "client_id"})
    client: User

    @ManyToOne(() => User, user => user.reviews, {nullable: false})
    @JoinColumn({name: "freelancer_id"})
    freelancer: User    

    @Column("int", {nullable: false})
    score: number;

    @Column("text", {nullable: false})
    description: string;

    @Column({type: "timestamp", name: "creation_date", default: new Date()})
    creationDate: Date;

}