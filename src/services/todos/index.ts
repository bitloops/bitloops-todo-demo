export type Todo = {
  id: string;
  title: string;
  description: string;
  status: string;
  iam: {
    users: { id: string; roles: string[] }[];
    groups: { id: string; roles: string[] }[];
  };
  ownerId: string;
};

export interface IToDosService {
  getAllMyToDos: () => Promise<Todo[]>;
  createTodo(id: string, name: string): Promise<void>;
  // fetchOneById(id: string): Promise<Application>;
  deleteOneTodoById(id: string): Promise<void>;
}
