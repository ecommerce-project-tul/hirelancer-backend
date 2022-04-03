import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("users")
export class User {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column("varchar")
    photo: string;

    @Column("varchar")
    email: string;

    @Column("varchar")
    password: string;

    @Column("varchar", {name: "first_name"})
    firstName: string;

    @Column("varchar", {name: "last_name"})
    lastName: string;

    @Column("varchar", {name: "user_role"})
    userRole: string;

    @Column("varchar", {name: "linkedin_token"})
    linkedInToken: string;

    @Column("varchar", {name: "github_link"})
    githubLink: string;

    @Column("varchar", {name: "linkedin_link"})
    linkedInLink: string;

    @Column("text")
    description: string;
}