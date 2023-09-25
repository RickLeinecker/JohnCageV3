import { Model, Table, Column, DataType } from "sequelize-typescript";

@Table({
  tableName: "Users",
})

class User extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: "ID"
  })
  ID?: number;

  @Column({
    type: DataType.STRING(45),
    field: "Role"
  })
  Role?: string;

  @Column({
    type: DataType.STRING(50),
    field: "FirstName"
  })
  FirstName?: string;

  @Column({
    type: DataType.STRING(50),
    field: "LastName"
  })
  LastName?: string;

  @Column({
    type: DataType.STRING(150),
    field: "Email"
  })
  Email?: string;

  @Column({
    type: DataType.STRING(50),
    field: "Password"
  })
  Password?: string;

  @Column({
    type: DataType.STRING(11),
    field: "Phone"
  })
  Phone?: string;

  @Column({
    type: DataType.STRING(45),
    field: "UserName"
  })
  UserName?: string;

  @Column({
    type: DataType.BOOLEAN,
    field: "IsAdmin"
  })
  IsAdmin?: boolean;

  @Column({
    type: DataType.BOOLEAN,
    field: "IsVerified"
  })
  IsVerified?: boolean;
}

export default User;