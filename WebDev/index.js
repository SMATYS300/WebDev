const express = require('express');
const mustacheExpress = require('mustache-express');
const bodyParser = require('body-parser');
const session = require('express-session');
const routes = require('./routes/routes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: true
}));

// Custom Mustache helper to compare values in templates
// const isEqualHelper = () => {
//   return function (val1, val2, options) {
//       return val1 === val2 ? options.fn(this) : options.inverse(this);
//   };
// };

app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', __dirname + '/views');


app.use('/', routes);

// app.use(function(req, res, next) {
//   res.locals.isEqual = isEqualHelper();
//   next();
// });
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

