const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    message: 'Railway test is working!'
  });
});

app.get('/', (req, res) => {
  res.json({
    message: 'Railway Test Server',
    status: 'running'
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Test server running on port ${PORT}`);
});


