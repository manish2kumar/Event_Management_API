const express = require('express');
const dotenv = require('dotenv');
require('./db');
const eventRoutes = require('./routes/events');

dotenv.config();

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Event Management API is live');
});

app.use('/api/events', eventRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at port ${PORT}`);
});
