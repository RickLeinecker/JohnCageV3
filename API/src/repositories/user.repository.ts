import { Op } from "sequelize";
import User from "../models/user.model";

interface IUserRepository {
  save(user: User): Promise<User>;
  retrieveAll(searchParams: {UserName: string, IsAdmin: boolean, IsVerified: boolean}): Promise<User[]>;
  retrieveById(userId: number): Promise<User | null>;
  update(user: User): Promise<number>;
  delete(userId: number): Promise<number>;
}
interface SearchCondition {
    [key: string]: any;
}

class UserRepository implements IUserRepository {
  async save(user: User): Promise<User> {
    try {
        return await User.create({
          Role: user.Role,
          FirstName: user.FirstName,
          LastName: user.LastName,
          Email: user.Email,
          Password: user.Password,
          Phone: user.Phone,
          UserName: user.UserName,
          IsAdmin: user.IsAdmin,
          IsVerified: user.IsVerified
        });
      } catch (err) {
        throw new Error("Failed to create User!");
      }
  }

  // async retrieveAll(searchParams: {UserName?: string, IsAdmin?: boolean, IsVerified: boolean}): Promise<User[]> {
    async retrieveAll(searchParams: {UserName?: string, IsAdmin?: boolean, IsVerified?: boolean}): Promise<User[]> {
    try {
        let condition: SearchCondition = {};
    
        // if (searchParams?.IsAdmin) condition.IsAdmin = true;

        // if (searchParams?.IsVerified) condition.IsVerified = true;
    
        if (searchParams?.UserName)
          condition.UserName = { [Op.like]: `%${searchParams.UserName}%` };
    
        return await User.findAll({ where: condition });
      } catch (error) {
        throw new Error("Failed to retrieve Users!");
      }
  }

  async retrieveById(userId: number): Promise<User | null> {
    try {
        return await User.findByPk(userId);
      } catch (error) {
        throw new Error("Failed to retrieve User!");
      }
  }

  async update(user: User): Promise<number> {
    const { ID, Role, FirstName, Email, Password, Phone, UserName, IsAdmin, IsVerified} = user;

    try {
      const affectedRows = await User.update(
        { ID, Role, FirstName, Email, Password, Phone, UserName, IsAdmin, IsVerified },
        { where: { id: ID } }
      );
  
      return affectedRows[0];
    } catch (error) {
      throw new Error("Failed to update User!");
    }
  }

  async delete(userId: number): Promise<number> {
    try {
        const affectedRows = await User.destroy({ where: { ID: userId } });
    
        return affectedRows;
      } catch (error) {
        throw new Error("Failed to delete User!");
      }
  }
}

export default new UserRepository();