import { IToDosService, Todo, UpdateTodoDTO } from '../index';

class MockToDosService implements IToDosService {
  private data: Todo[] = [
    {
      id: '24f132d4-6a41-4268-86d3-8d407eca3e85',
      title: 'Get milk',
      description: 'none',
      status: 'pending',
      iam: {
        users: [],
        groups: [],
      },
      ownerId: 'mockUserId',
    },
    {
      id: 'f8ea905b-47a9-429a-b272-55b6ba62b39c',
      title: 'Go shopping',
      description: 'none',
      status: 'pending',
      iam: {
        users: [],
        groups: [],
      },
      ownerId: 'mockUserId',
    },
    {
      id: '3aacc576-2011-42d1-a18b-bbdfc683a4c1',
      title: 'Water plants',
      description: 'none',
      status: 'pending',
      iam: {
        users: [],
        groups: [],
      },
      ownerId: 'mockUserId',
    },
  ];

  constructor() {
    console.log('Initializing mock Applications service');
  }

  async getAllMyToDos(): Promise<Todo[]> {
    return this.copy(this.data);
  }

  async fetchTodo(id: string): Promise<Todo> {
    return this.data.filter((todo) => todo.id === id)[0];
  }

  async createTodo(id: string, title: string): Promise<void> {
    const newTodo: Todo = {
      id,
      title,
      description: 'none',
      status: 'pending',
      iam: {
        users: [],
        groups: [],
      },
      ownerId: 'mockUserId',
    };

    this.data.push(newTodo);
  }

  async deleteOneTodoById(id: string): Promise<void> {
    this.data = this.data.filter((todo) => todo.id !== id);
  }

  async updateTodo(updateData: UpdateTodoDTO): Promise<void> {
    const todoIndex = this.data.findIndex((todo) => todo.id === updateData.todoId);
    let todo: Todo = { ...this.data[todoIndex] };
    updateData.updateData.title && (todo.title = updateData.updateData.title);
    updateData.updateData.description && (todo.description = updateData.updateData.description);
    updateData.updateData.color && (todo.color = updateData.updateData.color);
    this.data[todoIndex] = todo;
  }

  async checkTodo(id: string, checked: boolean): Promise<void> {
    const todoIndex = this.data.findIndex((todo) => todo.id === id);
    let todo: Todo = { ...this.data[todoIndex] };
    todo.status = checked ? 'completed' : 'pending';
    this.data[todoIndex] = todo;
  }
  /**
   * Used because of redux
   */
  private copy(any: any): any {
    return JSON.parse(JSON.stringify(any));
  }
}

export default MockToDosService;
