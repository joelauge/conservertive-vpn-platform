const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    message: 'ConSERVERtive VPN Server is running!'
  });
});

app.get('/', (req, res) => {
  res.json({
    message: 'ConSERVERtive VPN Server',
    version: '1.0.0',
    status: 'running'
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 ConSERVERtive VPN Server running on port ${PORT}`);
});


