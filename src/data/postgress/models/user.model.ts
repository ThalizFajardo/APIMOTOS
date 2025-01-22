import {
  BaseEntity,
  BeforeInsert,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";
import { encriptAdapter } from "../../../config";


export enum Status {
  AVALIABLE = "AVALIABLE",
  DISABLED = "DISABLED",
  BLOCKED = "BLOCKED"
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
  @Column("enum", {
    enum: Role,
    default: Role.CLIENT,
  })
  role: Role;

  //STATUS
  @Column("enum", {
    enum: Status,
    default: Status.AVALIABLE,
  })
  status: Status;

  //ok antes de que llegue la contraseña la encriptamos...
  @BeforeInsert()
  encryptedPassword() {
    this.password = encriptAdapter.hash(this.password)
  }
}
