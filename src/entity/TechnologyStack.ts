import { Column, Entity,  ManyToMany,  ManyToOne,  OneToMany,  OneToOne,  PrimaryGeneratedColumn } from "typeorm";
import { UserTechnologyStack } from "./UserTechnologyStack";

@Entity("technology_stacks")
export class TechnologyStack {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column("varchar")
    icon: string;

    @Column("varchar")
    name: string;
    
    @OneToMany(() => UserTechnologyStack, userTechnologyStack => userTechnologyStack.technologyStack )
    userTechnologyStacks: UserTechnologyStack[]
}