
export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  role: 0 | 1; // 0 for admin, 1 for client
}

export interface Todo {
  id: string;
  userId: string;
  title: string;
  completed: boolean;
  createdAt: number;
}

// User Storage Service
export const userStorage = {
  getUsers: (): User[] => {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];
  },
  
  saveUsers: (users: User[]): void => {
    localStorage.setItem('users', JSON.stringify(users));
  },
  
  addUser: (user: User): void => {
    const users = userStorage.getUsers();
    users.push(user);
    userStorage.saveUsers(users);
  },
  
  getUserById: (id: string): User | undefined => {
    return userStorage.getUsers().find(user => user.id === id);
  },
  
  getUserByEmail: (email: string): User | undefined => {
    return userStorage.getUsers().find(user => user.email === email);
  },
  
  updateUser: (updatedUser: User): void => {
    const users = userStorage.getUsers();
    const index = users.findIndex(user => user.id === updatedUser.id);
    
    if (index !== -1) {
      users[index] = updatedUser;
      userStorage.saveUsers(users);
    }
  },
  
  deleteUser: (id: string): void => {
    const users = userStorage.getUsers().filter(user => user.id !== id);
    userStorage.saveUsers(users);
  },

  getClients: (): User[] => {
    return userStorage.getUsers().filter(user => user.role === 1);
  }
};

// Todo Storage Service
export const todoStorage = {
  getTodos: (): Todo[] => {
    const todos = localStorage.getItem('todos');
    return todos ? JSON.parse(todos) : [];
  },
  
  saveTodos: (todos: Todo[]): void => {
    localStorage.setItem('todos', JSON.stringify(todos));
  },
  
  addTodo: (todo: Todo): void => {
    const todos = todoStorage.getTodos();
    todos.push(todo);
    todoStorage.saveTodos(todos);
  },
  
  getTodoById: (id: string): Todo | undefined => {
    return todoStorage.getTodos().find(todo => todo.id === id);
  },
  
  getTodosByUserId: (userId: string): Todo[] => {
    return todoStorage.getTodos().filter(todo => todo.userId === userId);
  },
  
  updateTodo: (updatedTodo: Todo): void => {
    const todos = todoStorage.getTodos();
    const index = todos.findIndex(todo => todo.id === updatedTodo.id);
    
    if (index !== -1) {
      todos[index] = updatedTodo;
      todoStorage.saveTodos(todos);
    }
  },
  
  deleteTodo: (id: string): void => {
    const todos = todoStorage.getTodos().filter(todo => todo.id !== id);
    todoStorage.saveTodos(todos);
  }
};

// Auth Service
export const authStorage = {
  setCurrentUser: (user: User): void => {
    localStorage.setItem('currentUser', JSON.stringify(user));
  },
  
  getCurrentUser: (): User | null => {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  },
  
  logout: (): void => {
    localStorage.removeItem('currentUser');
  },
  
  isAuthenticated: (): boolean => {
    return !!authStorage.getCurrentUser();
  },
  
  isAdmin: (): boolean => {
    const currentUser = authStorage.getCurrentUser();
    return currentUser ? currentUser.role === 0 : false;
  },
  
  isClient: (): boolean => {
    const currentUser = authStorage.getCurrentUser();
    return currentUser ? currentUser.role === 1 : false;
  }
};
