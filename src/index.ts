import server from './server';
import sequelize from './db/sequelize';

require('dotenv').config();

const port = process.env.PORT || 4000;

(async () => {
  await sequelize.sync({
    force: false,
  });

  server.listen(port, () => console.info(`Server running on port ${port}`));
})();
