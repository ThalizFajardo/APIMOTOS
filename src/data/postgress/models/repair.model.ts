import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from 'typeorm';


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

}
