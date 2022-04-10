import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { EUserRole } from "./enum/EUserRole";
import { TechnologyStack } from "./TechnologyStack";
import { User } from "./User";

@Entity("user_technology_stacks")
export class UserTechnologyStack {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ManyToOne(() => User, user => user.technologyStacks )
    @JoinColumn({name: "user_id"})
    user: User

    @ManyToOne(()=> TechnologyStack, technologyStack => technologyStack.id)
    @JoinColumn({name: "technology_stack_id"})
    technologyStack: TechnologyStack;

    // @Column({type: "uuid", name: "user_id"})
    // userId: string;


    // @Column({type: "uuid", name: "technology_stack_id"})
    // technologyStackId: string;



    @Column("int")
    score: number;
}