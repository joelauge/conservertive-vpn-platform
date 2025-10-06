const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    message: 'ConSERVERtive Backend API is running!'
  });
});

app.get('/', (req, res) => {
  res.json({
    message: 'ConSERVERtive Backend API',
    version: '1.0.0',
    status: 'running'
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 ConSERVERtive Backend API running on port ${PORT}`);
});


