export type Todo = {
  id: string;
  title: string;
  description?: string;
  status: string;
  color?: string;
  iam: {
    users: { id: string; roles: string[] }[];
    groups: { id: string; roles: string[] }[];
  };
  ownerId: string;
};

export interface UpdateTodoDTO {
  todoId: string;
  updateData: UpdateTodoData;
}

export interface UpdateTodoData {
  title?: string;
  description?: string;
  color?: string;
}

export interface IToDosService {
  getAllMyToDos: () => Promise<Todo[]>;
  createTodo(id: string, title: string): Promise<void>;
  fetchTodo(id: string): Promise<Todo>;
  deleteOneTodoById(id: string): Promise<void>;
  updateTodo(updateData: UpdateTodoDTO): Promise<void>;
  checkTodo(id:string, checked: boolean): Promise<void>;
}
