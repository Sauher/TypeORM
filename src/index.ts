import express from 'express';
import dotenv from 'dotenv';
import { AppDataSource } from './data-source';

dotenv.config();
const port = process.env.PORT || 3000;
const app = express();

app.use(express.json());

//Routes
import UserRoutes from './routes/user.routes';
import TaskRoutes from './routes/task.routes';

app.use('/api/users', UserRoutes);
app.use('/api/tasks', TaskRoutes);

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error('Error during Data Source initialization:', err);
    process.exit(1);
  });
