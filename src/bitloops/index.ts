import Bitloops, { BitloopsConfig } from 'bitloops';

import type { UpdateResponse } from './proto/todoApp';
import type { UpdateRequest } from './proto/todoApp';
import type { GetAllResponse } from './proto/todoApp';
import type { GetAllRequest } from './proto/todoApp';
import type { DeleteResponse } from './proto/todoApp';
import type { DeleteRequest } from './proto/todoApp';
import type { CreateResponse } from './proto/todoApp';
import type { CreateRequest } from './proto/todoApp';

export interface ITodoAppClient {
  /**
   * @generated from Bitloops Protobuf: Create(CreateRequest) returns (CreateResponse);
   */
  create(input: CreateRequest): Promise<[response: CreateResponse | null, error: any | null]>;
  /**
   * @generated from Bitloops Protobuf: Delete(DeleteRequest) returns (DeleteResponse);
   */
  delete(input: DeleteRequest): Promise<[response: DeleteResponse | null, error: any | null]>;
  /**
   * @generated from Bitloops Protobuf: GetAll(GetAllRequest) returns (GetAllResponse);
   */
  getAll(input: GetAllRequest): Promise<[response: GetAllResponse | null, error: any | null]>;
  /**
   * @generated from Bitloops Protobuf: Update(UpdateRequest) returns (UpdateResponse);
   */
  update(input: UpdateRequest): Promise<[response: UpdateResponse | null, error: any | null]>;
}

export class TodoAppClient implements ITodoAppClient {
  bitloopsApp: Bitloops;
  Events: { CREATED: string, DELETED: string, UPDATED: string };
  constructor(bitloopsConfig: BitloopsConfig) {
    this.bitloopsApp = Bitloops.initialize(bitloopsConfig);
    this.Events = {
      CREATED: 'workflow-events.ToDos.created',
      DELETED: 'workflow-events.ToDos.deleted',
      UPDATED: 'workflow-events.ToDos.updated',
    }
  }
  async subscribe(namedEvent: string, callback: (data: any) => void): Promise<void> {
    await this.bitloopsApp.subscribe(namedEvent, callback);
  }
  /**
   * @generated from Bitloops Protobuf: Create(CreateRequest) returns (CreateResponse);
   */
  async create(input: CreateRequest): Promise<[response: CreateResponse | null, error: any | null]> {
    try {
      const response: CreateResponse = await this.bitloopsApp.request(
        '88e761bf-4824-4974-96b4-45c7bf741f11',
        '9ea7d8d2-62db-4210-809f-6fc79b173c6d',
        input,
      );
      return [response, null];
    } catch (error) {
      console.error(error);
      return [null, error];
    }
  }
  /**
   * @generated from Bitloops Protobuf: Delete(DeleteRequest) returns (DeleteResponse);
   */
  async delete(input: DeleteRequest): Promise<[response: DeleteResponse | null, error: any | null]> {
    try {
      const response: DeleteResponse = await this.bitloopsApp.request(
        '88e761bf-4824-4974-96b4-45c7bf741f11',
        'f583c300-b21e-4a3b-ac7d-56f5489f530c',
        input,
      );
      return [response, null];
    } catch (error) {
      console.error(error);
      return [null, error];
    }
  }
  /**
   * @generated from Bitloops Protobuf: GetAll(GetAllRequest) returns (GetAllResponse);
   */
  async getAll(): Promise<[response: GetAllResponse | null, error: any | null]> {
    try {
      const response: GetAllResponse = await this.bitloopsApp.request(
        '88e761bf-4824-4974-96b4-45c7bf741f11',
        '616bb291-9521-4724-985c-b2048dde56a8'
      );
      return [response, null];
    } catch (error) {
      console.error(error);
      return [null, error];
    }
  }
  /**
   * @generated from Bitloops Protobuf: Update(UpdateRequest) returns (UpdateResponse);
   */
  async update(input: UpdateRequest): Promise<[response: UpdateResponse | null, error: any | null]> {
    try {
      const response: UpdateResponse = await this.bitloopsApp.request(
        '88e761bf-4824-4974-96b4-45c7bf741f11',
        'f9a51c7c-6b12-408f-a5ee-fb164cbabcc6',
        input,
      );
      return [response, null];
    } catch (error) {
      console.error(error);
      return [null, error];
    }
  }
}
