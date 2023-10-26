import { Model, Table, Column, DataType } from "sequelize-typescript";

@Table({
  tableName: "Recordings",
})

class Recording extends Model {
  
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: "ID"
  })
  ID?: number;

  @Column({
    type: DataType.STRING(255),
    field: "Title"
  })
  Title?: string;

  @Column({
    type: DataType.STRING(255),
    field: "FilePath"
  })
  FilePath?: string;

  @Column({
    type: DataType.INTEGER,
    field: "GroupID"
  })
  GroupID?: number;

  @Column({
    type: DataType.STRING(50),
    field: "Tag1"
  })
  Tag1?: string;

  @Column({
    type: DataType.STRING(50),
    field: "Tag2"
  })
  Tag2?: string;

  @Column({
    type: DataType.STRING(50),
    field: "Tag3"
  })
  Tag3?: string;
}

export default Recording;