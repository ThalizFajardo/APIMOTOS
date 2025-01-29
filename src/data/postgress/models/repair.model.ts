import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.model'; 

export enum RepairStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED"
}

@Entity()
export class Repair extends BaseEntity {
  //ID
  @PrimaryGeneratedColumn("uuid")
  id: string;

  //DATE
  @Column("date", {
    nullable: false,
  })
  date: Date;

  //MOTORSNUMBER
  @Column("varchar", {
    nullable: false,
    default:""
  })
  motorsNumber: string;
  
  //DESCRIPTION
  @Column("text", {
    nullable: false,
    default:""
  })
  description: string;

  //STATUS
  @Column("enum", {
    enum: RepairStatus,
    default: RepairStatus.PENDING
  })
  status: RepairStatus;

  @Column("varchar", {
    nullable: false,
  })
  userId: string;


  @ManyToOne(() => User, (user) => user.repairs)
    user: User;

}
