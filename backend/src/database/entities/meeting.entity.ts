import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm"
import { User } from "./user.entity"
import { Event } from "./event.entity"

export enum MeetingStatusEnum {
  SCHEDULE = "SCHEDULE",
  CANCELLED = "CANCELLED",
}

@Entity("meetings")
export class Meeting {
  @PrimaryGeneratedColumn("uuid")
  id: string

  // User who created the meeting: many
  @ManyToOne(() => User, (user) => user.meetings)
  user: User

  @ManyToOne(() => Event, (event) => event.meetings)
  event: Event

  @Column()
  guestName: string

  @Column()
  guestEmail: string

  @Column({ nullable: true })
  additionalInfo: string

  @Column()
  startTime: Date

  @Column()
  endTime: Date

  @Column()
  meetingLink: string

  @Column()
  calenderEventId: string

  @Column()
  calendarAppType: string

  @Column({
    type: "enum",
    enum: MeetingStatusEnum,
    default: MeetingStatusEnum.SCHEDULE,
  })
  status: MeetingStatusEnum

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date
}
