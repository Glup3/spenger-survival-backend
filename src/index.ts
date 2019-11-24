import server from './server';
import startConnection from './db/typeorm/typeorm';

require('dotenv').config({ path: `${__dirname}/../.env.${process.env.NODE_ENV}` });

const port = process.env.PORT || 4000;

(async () => {
  await startConnection();

  server.listen(port, () => console.info(`Server running on port ${port}`));
})();
