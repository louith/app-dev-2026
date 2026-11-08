const express = require('express');
// const errorHandler = require('./middleware/errorHandler');
const jwt = require('jsonwebtoken');
const postRoutes = require('./routes/postRoutes');
const app = express();

app.use(express.json());
// app.use('/api/users', userRoutes);
// app.use(errorHandler);
app.use('/posts', postRoutes);
module.exports = app;