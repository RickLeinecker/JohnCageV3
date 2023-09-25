import { Model, Table, Column, DataType } from "sequelize-typescript";

type TagObject = {
  id: number;
  tag: string;
}

@Table({
  tableName: "Tags",
})

class Tag extends Model {

  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: "idTags"
  })
  idTags?: number;

  @Column({
    type: DataType.STRING(500),
    field: "Tags"
  })
  Tags?: string;
}

export { TagObject, Tag }