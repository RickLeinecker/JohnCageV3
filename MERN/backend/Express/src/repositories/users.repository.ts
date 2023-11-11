import { Op } from 'sequelize';
import { users } from '../models/init-models';

interface IUsersRepository {
  //save(user: users): Promise<users>;
  retrieveAll(searchParams: {
    userName: string;
    IsAdmin: boolean;
    IsVerified: boolean;
  }): Promise<users[]>;
  retrieveById(usersId: number): Promise<users | null>;
  update(users: users): Promise<number>;
  delete(usersId: number): Promise<number>;
}
interface SearchCondition {
  [key: string]: any;
}

class UsersRepository implements IUsersRepository {
  // async save(users: users): Promise<users> {
  //   try {
  //       return await users.save({
  //         Role: users.Role,
  //         Name: users.Name,
  //         UserName: users.UserName,
  //         Email: users.Email,
  //         Password: users.Password,
  //         Phone: users.Phone,
  //         IsAdmin: users.IsAdmin,
  //         IsVerified: users.IsVerified
  //       }); // Restrict the user to only being allowed to set these fields. {fields: ['Role', 'Name', 'UserName', 'Email', 'Password', 'Phone', 'IsAdmin', 'IsVerified']}
  //     } catch (err) {
  //       throw new Error("Failed to create users!");
  //     }
  // }

  async retrieveAll(): Promise<users[]> {
    try {
      let condition: SearchCondition = {};

      return await users.findAll({
        attributes: ['ID', 'UserName'],
      });
    } catch (error) {
      throw new Error('Failed to retrieve Users!');
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

  async retrieveById(userId: number): Promise<users | null> {
    try {
      return await users.findByPk(userId);
    } catch (error) {
      throw new Error('Failed to retrieve User!');
    }
  }

  async update(user: users): Promise<number> {
    const { ID, UserName } = user;

    try {
      const affectedRows = await users.update(
        { ID, UserName },
        { where: { ID: ID } }
      );

      return affectedRows[0];
    } catch (error) {
      throw new Error('Failed to update User!');
    }
  }

  async delete(userId: number): Promise<number> {
    try {
      const affectedRows = await users.destroy({ where: { ID: userId } });

      return affectedRows;
    } catch (error) {
      throw new Error('Failed to delete User!');
    }
  }
}

export default new UsersRepository();
