import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm"
import { compareValue, hashValue } from "../../utils/bcrypt"
import { Integration } from "./integration.entity"
import { Event } from "./event.entity"
import { Availability } from "./availability.entity"
import { Meeting } from "./meeting.entity"

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({ nullable: false })
  name: string

  @Column({ nullable: false, unique: true })
  username: string

  @Column({ nullable: false, unique: true })
  email: string

  @Column({ nullable: false })
  password: string

  @Column({ nullable: true })
  imageUrl: string

  // Events
  @OneToMany(() => Event, (event) => event.user, { cascade: true })
  events: Event[]

  // Integrations
  @OneToMany(() => Integration, (integration) => integration.user, {
    cascade: true,
  })
  integrations: Integration[]

  // Availability
  @OneToOne(() => Availability, (availability) => availability.user, {
    cascade: true,
  })
  @JoinColumn()
  availability: Availability

  // MEETING
  @OneToMany(() => Meeting, (meeting) => meeting.user, { cascade: true })
  meetings: Meeting[]

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      this.password = await hashValue(this.password, 10)
    }
  }

  async comparePassword(password: string): Promise<boolean> {
    if (!this.password) {
      return false
    }
    return await compareValue(password, this.password)
  }

  omitPassword(): Omit<User, "password"> {
    const { password, ...userWithoutPassword } = this
    return userWithoutPassword as Omit<User, "password">
  }
}
