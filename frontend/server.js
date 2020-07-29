const express = require('express');
const app = express();

app.use(express.static('build'));

app.get('/', (req, res) => {
  res.send('Inicialized!');
});

app.listen(3000, () => console.log('Inicialized!'));
