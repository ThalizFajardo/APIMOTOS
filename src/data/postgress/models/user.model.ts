
import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";


export enum Status {
  AVALIABLE = "AVALIABLE",
  DISABLED = "DISABLED",
}

export enum Role {
  EMPLOYEE = "EMPLOYEE",
  CLIENT = "CLIENT",
}


@Entity()
export class User extends BaseEntity {
  //ID
  @PrimaryGeneratedColumn("uuid")
  id: string;

 //NOMBRE 
  @Column("varchar", {
    length: 80,
    nullable: false,
  })
  name: string;

//EMAIL
  @Column("varchar", {
    length: 80,
    nullable: false,
    unique: true,
  })
  email: string;

  //PASSWORD
  @Column("varchar", {
    nullable: false,
  })
  password: string;

//ROLE
  @Column( "enum",{
    enum: Role,
    default:Role.CLIENT, 
  })
  role : Role;

  //STATUS
  @Column("enum", {
    enum: Status,
    default: Status.AVALIABLE,
  })
  status: Status;

}
