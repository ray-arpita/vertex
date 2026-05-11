const express = require('express');
const cors = require('cors');
require('dotenv').config();
require('./config/db');
const { verifyToken } = require('./middleware/auth');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth',    verifyToken, require('./routes/auth'));
// app.use('/api/projects', require('./routes/projects'));
// app.use('/api/tasks', require('./routes/tasks'));
// app.use('/api/analytics', require('./routes/analytics'));
// app.use('/api/admin', require('./routes/admin'));




// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));