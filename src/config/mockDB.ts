interface User {
    id: number;
    name: string;
    email: string;
  }
  
  let users: User[] = [];
  let nextId = 1;
  
  const db = {
    insertUser: async (name: string, email: string): Promise<User> => {
      const user = { id: nextId++, name, email };
      users.push(user);
      return user;
    },
    getUsers: async (): Promise<User[]> => {
      return users;
    }
  };
  
  export default db;
  