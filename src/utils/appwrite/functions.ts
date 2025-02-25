import { functions } from './config';

const getFunction = async (funcId: string) => {
  try {
    const res = await functions.getExecution(funcId, 'executionId');
    return res;
  } catch (error) {
    console.error('Error getting function:', error);
  }
};

getFunction('listProducts');
