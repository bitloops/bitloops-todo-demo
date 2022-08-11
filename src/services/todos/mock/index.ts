import { IToDosService, Todo } from '../index';

class MockToDosService implements IToDosService {
  private mockData: Todo[] = [
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
      id: '24f132d4-6a41-4268-86d3-dd407eca3e85',
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
      id: '24f132d4-6a41-4268-86d3-8g407eca3e85',
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
    return this.copy(this.mockData);
  }

  async createTodo(id: string, title: string): Promise<void> {
    const newTodo: Todo = {
      id: (this.mockData.length + 1).toString(),
      title,
      description: 'none',
      status: 'pending',
      iam: {
        users: [],
        groups: [],
      },
      ownerId: 'mockUserId',
    };

    this.mockData.push(newTodo);
  }

  deleteOneTodoById(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }

  /**
   * Used because of redux
   */
  private copy(any: any): any {
    return JSON.parse(JSON.stringify(any));
  }
}

export default MockToDosService;
