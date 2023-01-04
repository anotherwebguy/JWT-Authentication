import http from 'http';
import app from './app.js';
import dotenv from 'dotenv';
dotenv.config()

const server = http.createServer(app);

const { API_PORT } = process.env;
const port = process.env.PORT || API_PORT;

// server listening 
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});