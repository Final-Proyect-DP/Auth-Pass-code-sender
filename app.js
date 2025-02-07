require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const yaml = require('yamljs');
const connectDB = require('./config/db');
const connectRedis = require('./config/redis');
const emailRoutes = require('./routes/emailRoutes');

const app = express();
app.use(bodyParser.json());

const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 200
  };
app.use(cors(corsOptions));

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', service: 'auth-pass-code-sender' });
  });
  
connectDB();

const redisClient = connectRedis();

const swaggerDocument = yaml.load('./swagger.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/email', emailRoutes(redisClient));

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});
