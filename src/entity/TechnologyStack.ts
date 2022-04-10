import { Column, Entity,  ManyToMany,  ManyToOne,  OneToOne,  PrimaryGeneratedColumn } from "typeorm";
import { UserTechnologyStack } from "./UserTechnologyStack";

@Entity("technology_stacks")
export class TechnologyStack {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column("varchar")
    icon: string;

    @Column("varchar")
    name: string;
    
}