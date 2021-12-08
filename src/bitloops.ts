import Bitloops, { AuthTypes } from 'bitloops';
import bitloopsConfig from './bitloopsConfig';

const bitloops = Bitloops.initialize(bitloopsConfig);
bitloops.authenticate({
  authenticationType: AuthTypes.Anonymous, // change this
});

export { bitloops };
