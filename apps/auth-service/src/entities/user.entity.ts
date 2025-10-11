import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    BeforeInsert,
} from "typeorm";
import { RefreshToken } from "./refresh-token.entity";
import * as bcrypt from "bcrypt";

@Entity("users")
export class User {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ unique: true })
    username: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user, { cascade: true })
    refreshTokens: RefreshToken[];

    @BeforeInsert()
    async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
    }
}
