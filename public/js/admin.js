
//searching the users


// Get the search input and table rows
const searchInput = document.querySelector('input[type="search"]');
const tableRows = document.querySelectorAll('tbody tr');
const noResultsMessage = document.getElementById('noResultsFound');


// Add an event listener to the search input
searchInput.addEventListener('input', function() {
  const searchValue = this.value.toLowerCase();
  let found = false;


  // Loop through the table rows and hide/show them based on the search input
  tableRows.forEach(function(row) {
    const name = row.querySelector('td:nth-of-type(1)').textContent.toLowerCase();
    const email = row.querySelector('td:nth-of-type(2)').textContent.toLowerCase();
    const category = row.querySelector('td:nth-of-type(3)').textContent.toLowerCase();

    if (name.includes(searchValue) || email.includes(searchValue) || category.includes(searchValue)) {
      row.style.display = 'table-row';
      found = true;

    } else {
      row.style.display = 'none';
    }
  });

  // Show the "No results found" message if no results were found
  if (!found) {
    noResultsMessage.style.display = 'block';
  } else {
    noResultsMessage.style.display = 'none';
  }
});



var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl)
})
