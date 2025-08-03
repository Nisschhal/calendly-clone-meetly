import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm"
import { IntegrationAppTypeEnum } from "./integration.entity"
import { User } from "./user.entity"
import { Meeting } from "./meeting.entity"

// TODO: add location like in person or online
export enum EventLocationEnumType {
  GOOGLE_MEET_AND_CALENDER = IntegrationAppTypeEnum.GOOGLE_MEET_AND_CALENDER,
  ZOOM_MEETING = IntegrationAppTypeEnum.ZOOM_MEETING,
}

@Entity("events")
export class Event {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({ nullable: false })
  title: string

  @Column({ nullable: false })
  description: string

  @Column({ nullable: false })
  slug: string

  @Column({ default: false })
  isPrivate: boolean

  @Column({ default: 30 })
  duration: number

  @Column({ type: "enum", enum: EventLocationEnumType })
  locationType: EventLocationEnumType

  @ManyToOne(() => User, (user) => user.events)
  user: User

  // MEETING
  @OneToMany(() => Meeting, (meeting) => meeting.event)
  meetings: Meeting[]

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date
}
