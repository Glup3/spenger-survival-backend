import { createConnection } from 'typeorm';

const startConnection = async () => {
  await createConnection();
};

export default startConnection;
