import { Op } from "sequelize";
import { Users } from "../models/Users";

interface IUsersRepository {
  save(user: Users): Promise<Users>;
  retrieveAll(searchParams: {userName: string, IsAdmin: boolean, IsVerified: boolean}): Promise<Users[]>;
  retrieveById(usersId: number): Promise<Users | null>;
  update(users: Users): Promise<number>;
  delete(usersId: number): Promise<number>;
}
interface SearchCondition {
    [key: string]: any;
}

class UsersRepository implements IUsersRepository {
  async save(users: Users): Promise<Users> {
    try {
        return await Users.create({
          Role: users.Role,
          FirstName: users.FirstName,
          LastName: users.LastName,
          Email: users.Email,
          Password: users.Password,
          Phone: users.Phone,
          UserName: users.UserName,
          IsAdmin: users.IsAdmin,
          isVerified: users.isVerified
        }, {fields: ['FirstName', 'LastName', 'Email', 'Password', 'Phone', 'UserName']}); // Restrict the user to only being allowed to set these fields.
      } catch (err) {
        throw new Error("Failed to create users!");
      }
  }

  async retrieveAll(): Promise<Users[]> {
    try {
        let condition: SearchCondition = {};
    
        return await Users.findAll({
          attributes: ['ID', 'UserName']
        });
      } catch (error) {
        throw new Error("Failed to retrieve Users!");
      }
  }

  // async retrieveAll(searchParams: {userName?: string, IsAdmin?: boolean, IsVerified: boolean}): Promise<users[]> {
    // async retrieveAll(searchParams: {userName?: string, IsAdmin?: boolean, IsVerified?: boolean}): Promise<Users[]> {
  //     async retrieveAll(): Promise<Users[]> {
  //   try {
  //       let condition: SearchCondition = {};
    
  //       // if (searchParams?.IsAdmin) condition.IsAdmin = true;

  //       // if (searchParams?.IsVerified) condition.IsVerified = true;
    
  //       // if (searchParams?.userName)
  //       //   condition.userName = { [Op.like]: `%${searchParams.userName}%` };

  //       let {} = Users.getAttributes();
    
  //       return await Users.findAll();
  //     } catch (error) {
  //       throw new Error("Failed to retrieve Users!");
  //     }
  // }

  async retrieveById(userId: number): Promise<Users | null> {
    try {
        return await Users.findByPk(userId);
      } catch (error) {
        throw new Error("Failed to retrieve User!");
      }
  }

  async update(user: Users): Promise<number> {
    const { ID, Role, FirstName, Email, Password, Phone, UserName, IsAdmin, isVerified} = user;

    try {
      const affectedRows = await Users.update(
        { ID, Role, FirstName, Email, Password, Phone, UserName, IsAdmin, isVerified },
        { where: { ID: ID } }
      );
  
      return affectedRows[0];
    } catch (error) {
      throw new Error("Failed to update User!");
    }
  }

  async delete(userId: number): Promise<number> {
    try {
        const affectedRows = await Users.destroy({ where: { ID: userId } });

        return affectedRows;
      } catch (error) {
        throw new Error("Failed to delete User!");
      }
  }
}

export default new UsersRepository();