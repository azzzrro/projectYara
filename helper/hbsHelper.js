const hbs = require('hbs');
const path = require('path');

const partialsPath = path.join(__dirname, '../views/partials');


hbs.registerPartials(path.join(partialsPath, 'home'));
hbs.registerPartials(path.join(partialsPath, 'dashboard'));
hbs.registerPartials(path.join(partialsPath, 'signup'));



hbs.registerHelper('slice', function (context, start, end) {
  return context.slice(start, end);
});


hbs.registerHelper('checkStock', function (stock, options) {
  if (stock <= 5) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
});


hbs.registerHelper('eq', function (a, b) {
  return a === b;
});


hbs.registerHelper('gt', function (a, b, options) {
  if (a > b) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
});

hbs.registerHelper('range', function(start, end) {
  const result = [];
  for (let i = start; i <= end; i++) {
    result.push(i);
  }
  return result;
});



hbs.registerHelper('lt', function (a, b, options) {
  if (a < b) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
});


hbs.registerHelper('subtract', function (a, b) {
  return a - b;
});


hbs.registerHelper('add', function (a, b) {
  return a + b;
});


module.exports = hbs;