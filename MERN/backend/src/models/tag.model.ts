import { Model, Table, Column, DataType } from "sequelize-typescript";

@Table({
  tableName: "Tags",
})

class Tag extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: "ID"
  })
  ID?: number;

  @Column({
    type: DataType.STRING(255),
    field: "Tag"
  })
  Title?: string;
}

export default Tag;