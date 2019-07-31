const express = require('express');
const helmet = require('helmet');

const app = express();
const port = process.env.PORT || 3000;

app.use(helmet());
app.use(express.static('dist'));

app.listen(port, () => console.log(`Mailyard SPA listening on port ${port}!`));
