import Bitloops, { AuthTypes } from 'bitloops';
import bitloopsConfig from '../bitloopsConfig';

const bitloopsApp = Bitloops.initialize(bitloopsConfig);
bitloopsApp.authenticate({
  authenticationType: AuthTypes.Anonymous, // change this
  token: '',
});

// type Item = {
//   text: string;
//   status: boolean;
//   id: string;
// };

const TodoCommands = {
  CREATE: 'create',
  DELETE: 'delete',
  GET_ALL: 'getAll',
  UPDATE: 'update',
};

const TodoEvents = {
  CREATE: 'workflow-events.ToDos.create',
  DELETE: 'workflow-events.ToDos.delete',
  UPDATE: 'workflow-events.ToDos.update',
}

const todo = async (payload: {command: string, key?: string, data?: any}): Promise<[response: {response: string | undefined, data: { text: string, id: string, status: string }[] | undefined} | null, error: any | null]> => {
  try {
    const response: {response: string | undefined, data: { text: string, id: string, status: string }[] | undefined} = await bitloopsApp.request(
      '88e761bf-4824-4974-96b4-45c7bf741f11',
      '9eac4f54-d4db-4fe9-b5a4-f1c6d527c446',
      payload
    );
    return [response, null];
  } catch (error) {
    console.error(error);
    return [null, error];
  }
};

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



const bitloops = {
  todo,
  getAll,
  TodoCommands,
  TodoEvents,
  app: bitloopsApp,
};


export default bitloops;
