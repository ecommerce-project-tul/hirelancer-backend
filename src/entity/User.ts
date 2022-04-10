import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Announcement } from "./Announcement";
import { EUserRole } from "./enum/EUserRole";
import { Offer } from "./Offer";
import { Review } from "./Review";
import { UserTechnologyStack } from "./UserTechnologyStack";

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

    @Column({type: "varchar", enum: EUserRole})
    role: EUserRole;

    @Column("varchar", {name: "linkedin_token"})
    linkedInToken: string;

    @Column("varchar", {name: "github_link"})
    githubLink: string;

    @Column("varchar", {name: "linkedin_link"})
    linkedInLink: string;

    @Column("text")
    description: string;

    @OneToMany(() => Review, review => review.client)
    reviews: Review[];

    @OneToMany(() => Announcement, announcement => announcement.client)
    announcements: Announcement[];

    @OneToMany(() => Offer, offer => offer.freelancer)
    offers: Offer[];

    @OneToMany(() => UserTechnologyStack, userTechnologyStack => userTechnologyStack.user)
    technologyStacks: UserTechnologyStack[]
}