export default {
  jwtSecret: process.env.JWT_SECRET || 'secret',
  port: Number(process.env.PORT) || 3000,
  database: {
    type: process.env.TYPEORM_CONNECTION || 'postgres',
    host: process.env.TYPEORM_HOST || 'localhost',
    port: Number(process.env.TYPEORM_PORT) || 5432,
    user: process.env.TYPEORM_USERNAME || 'postgres',
    pass: process.env.TYPEORM_PASSWORD || '2077',
    name: process.env.TYPEORM_DATABASE || 'banco_sol_db',
    synchronize: process.env.TYPEORM_SYNCHRONIZE === 'true',
    logging: process.env.TYPEORM_LOGGING === 'true',
  },
};
