const express = require('express');
const bodyParser = require('body-parser');
const driversRoutes = require('./routes/partyRoutes');

const app = express();


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// PORT
const port = process.env.PORT || 3000;
app.use('/api/v1/parties', driversRoutes);
app.listen(port, () => console.log(`listening on port ${port}`));

module.exports = app;
