const redis = require('redis');

const connectRedis = () => {
    const redisClient = redis.createClient({ url: process.env.REDIS_URL });
    
    redisClient.on('connect', () => {
        console.log('Successfully connected to Redis');
    });

    redisClient.on('error', (err) => {
        console.log('Redis error: ', err);
    });
    
    return redisClient;
};

module.exports = connectRedis;
