import Bitloops, { AuthTypes } from 'bitloops';
import bitloopsConfig from './bitloopsConfig';

const bitloops = Bitloops.initialize(bitloopsConfig);
bitloops.authenticate({
  authenticationType: AuthTypes.Anonymous, // change this
  token: '',
});

const todoWorkflow = async (payload: any) => {
  try {
    const response = await bitloops.request(
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

export { bitloops, todoWorkflow };
