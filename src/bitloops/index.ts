import Bitloops, { AuthTypes } from 'bitloops';
import bitloopsConfig from '../bitloopsConfig';

import type { UpdateResponse } from './proto/todoApp';
import type { UpdateRequest } from './proto/todoApp';
import type { GetAllResponse } from './proto/todoApp';
import type { GetAllRequest } from './proto/todoApp';
import type { DeleteResponse } from './proto/todoApp';
import type { DeleteRequest } from './proto/todoApp';
import type { CreateResponse } from './proto/todoApp';
import type { CreateRequest } from './proto/todoApp';

const bitloopsApp = Bitloops.initialize(bitloopsConfig);
bitloopsApp.authenticate({
  authenticationType: AuthTypes.Anonymous, // change this
  token: '',
});

export type Todo = {
  text: string;
  status: string;
  id: string;
};

const TodoEvents = {
  CREATED: 'workflow-events.ToDos.created',
  DELETED: 'workflow-events.ToDos.deleted',
  UPDATED: 'workflow-events.ToDos.updated',
}

const getAll = async (): Promise<[response: {data: { text: string, id: string, status: string }[] | undefined} | null, error: any | null]> => {
  try {
    const response: {data: { text: string, id: string, status: string }[] | undefined} = await bitloopsApp.request(
      '88e761bf-4824-4974-96b4-45c7bf741f11',
      '616bb291-9521-4724-985c-b2048dde56a8'
    );
    return [response, null];
  } catch (error) {
    console.error(error);
    return [null, error];
  }
};

const create = async (todo: Todo): Promise<[response: {wasCreated: string} | null, error: any | null]> => {
  try {
    const response: {wasCreated: string} = await bitloopsApp.request(
      '88e761bf-4824-4974-96b4-45c7bf741f11',
      '9ea7d8d2-62db-4210-809f-6fc79b173c6d',
      todo,
    );
    return [response, null];
  } catch (error) {
    console.error(error);
    return [null, error];
  }
};

const del = async (id: string): Promise<[response: { wasDeleted: string } | null, error: any | null]> => {
  try {
    const response: { wasDeleted: string } = await bitloopsApp.request(
      '88e761bf-4824-4974-96b4-45c7bf741f11',
      'f583c300-b21e-4a3b-ac7d-56f5489f530c',
      { id },
    );
    return [response, null];
  } catch (error) {
    console.error(error);
    return [null, error];
  }
};

const update = async (todo: Todo): Promise<[response: {wasUpdated: string} | null, error: any | null]> => {
  try {
    const response: {wasUpdated: string} = await bitloopsApp.request(
      '88e761bf-4824-4974-96b4-45c7bf741f11',
      'f9a51c7c-6b12-408f-a5ee-fb164cbabcc6',
      todo,
    );
    return [response, null];
  } catch (error) {
    console.error(error);
    return [null, error];
  }
};


const bitloops = {
  todoApp: {
    getAll,
    create,
    del,
    update,
  },
  TodoEvents,
  app: bitloopsApp,
};

export interface ITodoAppClient {
  /**
   * @generated from protobuf rpc: Create(CreateRequest) returns (CreateResponse);
   */
  create(input: CreateRequest): Promise<CreateResponse>;
  /**
   * @generated from protobuf rpc: Delete(DeleteRequest) returns (DeleteResponse);
   */
  delete(input: DeleteRequest): Promise<DeleteResponse>;
  /**
   * @generated from protobuf rpc: GetAll(GetAllRequest) returns (GetAllResponse);
   */
  getAll(input: GetAllRequest): Promise<GetAllResponse>;
  /**
   * @generated from protobuf rpc: Update(UpdateRequest) returns (UpdateResponse);
   */
  update(input: UpdateRequest): Promise<UpdateResponse>;
}

export class TodoAppClient implements ITodoAppClient {
  bitloopsApp: Bitloops;
  constructor() {
    this.bitloopsApp = Bitloops.initialize(bitloopsConfig);
    this.bitloopsApp.authenticate({
      authenticationType: AuthTypes.Anonymous, // change this
      token: '',
    });
  }
  /**
   * @generated from protobuf rpc: Create(CreateRequest) returns (CreateResponse);
   */
  async create(input: CreateRequest): Promise<CreateResponse> {
      return await this.bitloopsApp.request(
        '88e761bf-4824-4974-96b4-45c7bf741f11',
        '9ea7d8d2-62db-4210-809f-6fc79b173c6d',
        input,
      );
  }
  /**
   * @generated from protobuf rpc: Delete(DeleteRequest) returns (DeleteResponse);
   */
  async delete(input: DeleteRequest): Promise<DeleteResponse> {
      return await this.bitloopsApp.request(
        '88e761bf-4824-4974-96b4-45c7bf741f11',
        'f583c300-b21e-4a3b-ac7d-56f5489f530c',
        input,
      );
  }
  /**
   * @generated from protobuf rpc: GetAll(GetAllRequest) returns (GetAllResponse);
   */
  async getAll(): Promise<GetAllResponse> {
    return await this.bitloopsApp.request(
      '88e761bf-4824-4974-96b4-45c7bf741f11',
      '616bb291-9521-4724-985c-b2048dde56a8'
    );
  }
  /**
   * @generated from protobuf rpc: Update(UpdateRequest) returns (UpdateResponse);
   */
  async update(input: UpdateRequest): Promise<UpdateResponse> {
      return await this.bitloopsApp.request(
        '88e761bf-4824-4974-96b4-45c7bf741f11',
        'f9a51c7c-6b12-408f-a5ee-fb164cbabcc6',
        input,
      );
  }
}

export default bitloops;
