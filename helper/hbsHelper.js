const hbs = require('hbs');
const path = require('path');
const handlebars = require('handlebars')
const handlebarsHelpers = require('handlebars-helpers')()
const moment = require('moment');


const partialsPath = path.join(__dirname, '../views/partials');


hbs.registerPartials(path.join(partialsPath, 'home'));
hbs.registerPartials(path.join(partialsPath, 'dashboard'));
hbs.registerPartials(path.join(partialsPath, 'signup'));



hbs.registerHelper('compareDates', function(dateString) {

  const returnEndDate = new Date(dateString);
  const currentDate = new Date();
  return returnEndDate <= currentDate;
  
});

hbs.registerHelper('formatDate', function(date) {
  return moment(date).format('MMMM D, YYYY');
});

hbs.registerHelper('and', function () {
  const values = Array.prototype.slice.call(arguments);
  return values.slice(0, -1).every(Boolean);
});

hbs.registerHelper('or', function () {
  const values = Array.prototype.slice.call(arguments);
  return values.slice(0, -1).some(Boolean);
});

hbs.registerHelper('notEmpty', function(array, options) {
  if (array && array.length > 0) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
});

hbs.registerHelper('slice', function (context, start, end) {
  return context.slice(start, end);
});


hbs.registerHelper('checkStock', function (stock) {
  return (stock <= 5 && stock >=3)  
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


hbs.registerHelper("json", function (context) {
  return JSON.stringify(context)
})



module.exports = hbs;