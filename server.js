const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('./models/tourModel');

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

// 🔧 Обгортаємо все в асинхронну функцію
const startServer = async () => {
  try {
    await mongoose.connect(DB);
    console.log('✅ Connection to DB successful!');

    // СИНХРОНІЗАЦІЯ ІНДЕКСІВ — тут!
    await Tour.syncIndexes();
    console.log('✅ Tour indexes synchronized');

    const port = process.env.PORT || 3000;
    const server = app.listen(port, () => {
      console.log(`🚀 Server listening on port ${port}...`);
    });

    process.on('unhandledRejection', (err) => {
      console.log('UNHANDLED REJECTION! 💥 Shutting down...');
      console.log(err.name, err.message);
      server.close(() => {
        process.exit(1);
      });
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
};

startServer();
