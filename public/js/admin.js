

  /////////////// SEARCHING ////////////////////

// Get the search input and table rows
const searchInput = document.querySelector('input[type="search"]');
const tableRows = document.querySelectorAll("tbody tr");
const noResultsMessage = document.getElementById("noResultsFound");

// Add an event listener to the search input

if(searchInput){
searchInput.addEventListener("input", function () {
    const searchValue = this.value.toLowerCase();
    let found = false;

    // Loop through the table rows and hide/show them based on the search input
    tableRows.forEach(function (row) {
        const name = row.querySelector("td:nth-of-type(1)").textContent.toLowerCase();
        const email = row.querySelector("td:nth-of-type(2)").textContent.toLowerCase();
        const category = row.querySelector("td:nth-of-type(3)").textContent.toLowerCase();

        if (name.includes(searchValue) || email.includes(searchValue) || category.includes(searchValue)) {
            row.style.display = "table-row";
            found = true;
        } else {
            row.style.display = "none";
        }
    });

    // Show the "No results found" message if no results were found
    if (!found) {
        noResultsMessage.style.display = "block";
    } else {
        noResultsMessage.style.display = "none";
    }
});
}



  /////////////// TOOLTIP ////////////////////

var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
});



  /////////////// CATEGORY AND PRODUCT ////////////////////


// Get the select element and input field
const brandSelect = document.getElementById("brand-select");
const newBrandInput = document.getElementById("new-brand-input");

// Add event listener to the select element
if (brandSelect) {
  brandSelect.addEventListener("change", function () {
    const selectedOption = brandSelect.value;

    // Check if the selected option is "new"
    if (selectedOption === "new") {
      newBrandInput.classList.remove("d-none"); // Remove the d-none class
    } else {
      newBrandInput.classList.add("d-none"); // Add the d-none class
    }
  });
}







$(document).ready(function () {


  //category unlist confirmation

    $(".categoryUnlistBtn").click(async function (e) {
        e.preventDefault();
        var id = $(this).val();

        const result = await Swal.fire({
            title: "Are you sure?",
            text: "Do you really want to unlist this category?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Unlist it!",
        });

        if (result.value) {
            try {
                const response = await fetch("/admin/unlistCategory/" + id, {
                    method: "GET",
                });

                if (response.ok) {
                    const result2 = await Swal.fire({
                        icon: "success",
                        title: "Category has been unlisted successfully",
                        showConfirmButton: true,
                        confirmButtonText: "OK",
                        confirmButtonColor: "#4CAF50",
                    });

                    if (result2) {
                        location.reload();
                    }
                }
            } catch (error) {
                console.error(error);
            }
        }
    });



    //category unlist confirmation

    $(".subCategoryUnlistBtn").click(async function (e) {
      e.preventDefault();
      var id = $(this).val();

      const result = await Swal.fire({
          title: "Are you sure?",
          text: "Do you really want to unlist this Sub-Category?",
          icon: "question",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, Unlist it!",
      });

      if (result.value) {
          try {
              const response = await fetch("/admin/unlistSubCategory/" + id, {
                  method: "GET",
              });

              if (response.ok) {
                  const result2 = await Swal.fire({
                      icon: "success",
                      title: "Sub-Category has been unlisted successfully",
                      showConfirmButton: true,
                      confirmButtonText: "OK",
                      confirmButtonColor: "#4CAF50",
                  });

                  if (result2) {
                      location.reload();
                  }
              }
          } catch (error) {
              console.error(error);
          }
      }
  });



  //product delete confirmation


    $(".productDeleteBtn").click(async function (e) {
        e.preventDefault();
        var id = $(this).val();

        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        });

        if (result.value) {
            try {
                const response = await fetch("/admin/deleteProduct/" + id, {
                    method: "GET",
                });

                if (response.ok) {
                    const result2 = await Swal.fire({
                        icon: "success",
                        title: "Product has been deleted successfully",
                        showConfirmButton: true,
                        confirmButtonText: "OK",
                        confirmButtonColor: "#4CAF50",
                    });

                    if (result2) {
                        location.reload();
                    }
                }
            } catch (error) {
                console.error(error);
            }
        }
    });
});




  /////////////// ADD COUPON ////////////////////

  const addCouponForm = document.getElementById('addCoupon');

  if (addCouponForm){
  
  addCouponForm.addEventListener('submit', async function(event) {
    event.preventDefault();
  
    const form = event.target;
    const formData = new FormData(form);
  
    try {
        const response = await fetch('/admin/addCoupon', {
            method: 'POST',
            body: JSON.stringify(Object.fromEntries(formData)),
            headers: {
              'Content-Type': 'application/json'
            }
          });

          const data = await response.json()
  
      if (data.message === "coupon addedd") {
        const result = await Swal.fire({
            icon: "success",
            title: "New Coupon added Successfully",
            showConfirmButton: true,
            confirmButtonText: "OK",
            confirmButtonColor: "#4CAF50"
            
        });
            if(result.value){
                form.reset()
                window.location.href = '/admin/coupons'
            }
        
      } else {
        Swal.fire({
            icon: "error",
            title: "Some error occured",
            showConfirmButton: true,
            confirmButtonText: "CANCEL",
            confirmButtonColor: "#D22B2B"
            
        });
      }
    } catch (error) {
      console.log('Error:', error.message);
    }
  });
}



  
  /////////////// DELETE COUPON ////////////////////


  const deleteCoupon = async(couponId)=>{
    try{
  
      const result = await Swal.fire({
        title: 'Delete Coupon',
        text: 'Do you want to delete this coupon? \nThis cannot be undo!',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33", 
        confirmButtonText: 'Yes,Delete',
        cancelButtonText: 'DISMISS'
        
    });
  
    if(result.value){
  
      const response = await fetch(`/admin/deleteCoupon?couponId=${couponId}`,{
        method: 'POST'
      })
  
      const data = await response.json()
  
      if(data.message = "success"){
        Swal.fire({
          icon: "success",
          title: "Coupon has been deleted successfully",
          showConfirmButton: true,
          confirmButtonText: "OK",
          confirmButtonColor: "#4CAF50",
      });
      document.getElementById('couponRow' + couponId).innerHTML = ''
      }else{
  
        Swal.fire({
          icon: "error",
          title: "Somthing error!!",
          showConfirmButton: true,
          confirmButtonText: "DISMISS",
          confirmButtonColor: "#D22B2B"
          
      });
  
      }
  
    }
  
    }catch(error){
      console.log(error.message);
    }
  }
  

  const blockCoupon = async(couponId)=>{
    try{
  
      const result = await Swal.fire({
        title: 'Block Coupon',
        text: 'Do you want to block this coupon?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33", 
        confirmButtonText: 'Yes, Block',
        cancelButtonText: 'DISMISS'
        
    });
  
    if(result.value){
  
      const response = await fetch(`/admin/blockCoupon?couponId=${couponId}`,{
        method: 'POST'
      })
  
      const data = await response.json()
  
      if(data.message = "success"){
        const result = await Swal.fire({
          icon: "success",
          title: "Coupon has been blocked successfully",
          showConfirmButton: true,
          confirmButtonText: "OK",
          confirmButtonColor: "#4CAF50",
      });

      if(result.value){
        location.reload()
      }
      
      }else{
  
        Swal.fire({
          icon: "error",
          title: "Somthing error!!",
          showConfirmButton: true,
          confirmButtonText: "DISMISS",
          confirmButtonColor: "#D22B2B"
          
      });
  
      }
  
    }
  
    }catch(error){
      console.log(error.message);
    }
  }
  

  /////////////// ORDER UPDATE ////////////////////



  const orderUpdateSelects = document.querySelectorAll('[name="orderUpdate"]')

  if(orderUpdateSelects){
    orderUpdateSelects.forEach((orderUpdateSelect) => {
    orderUpdateSelect.addEventListener('change', async ()=>{
      console.log("helloo");
      const selectedOption = orderUpdateSelect.value
      const orderId = orderUpdateSelect.id.split('-')[1]

      try {

        const result = await Swal.fire({
          title: `Confirm Change Order Status to "${selectedOption}"?`,
          icon: 'question',
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33", 
          confirmButtonText: 'Yes, Change',
          cancelButtonText: 'DISMISS'
          
      });

      if(result.value){
        const response = await fetch(`/admin/updateOrder?orderId=${orderId}`,{
          method: 'POST',
          headers:{
            'Content-Type' : "application/json"
          },
          body: JSON.stringify({
            status: selectedOption
          })
        })
      
        const data = await response.json()
  
        if(data.message = "Success"){
          const result = await Swal.fire({
            icon: "success",
            title: "Order staus has been changed successfully!!",
            showConfirmButton: true,
            confirmButtonText: "OK",
            confirmButtonColor: "#4CAF50",
        });
      }
      
      if(result.value){
        location.reload()
      } 
      
      }

        
      } catch (error) {
        console.log(error.message);
      }
    })
  })
  }


  /////////////// DASHBOARD DATA ////////////////////

  let months
  let ordersByMonth
  let revenueByMonth
  let orderData


  /////////////// Graph data ////////////////////


  
  if (window.location.pathname === '/admin/dashboard') {
  // Move the Chart rendering code inside the window.onload event listener
window.onload = function() {
  // Place your existing JavaScript code here
  // ...

  const getChartData = async()=>{
    const response = await fetch('/admin/chartData',{
      headers:{
        'Content-Type': 'application/json'
      }
    })

    const data = await response.json()

    console.log(data);

    months = data.months
    ordersByMonth = data.ordersByMonth
    revenueByMonth = data.revenueByMonth

    salesGraph(months, ordersByMonth)
    revenue(months, data.revenueByMonth)
  }


  function salesGraph(months, ordersByMonth) {
    const ctx = document.getElementById('myChart');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: months,
        datasets: [{
          label: '# of sales',
          data: ordersByMonth,
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  function revenue(months, revenueByMonth) {
    const ctx1 = document.getElementById('myChart1');
    new Chart(ctx1, {
      type: 'line',
      data: {
        labels: months,
        datasets: [{
          label: '# Revenue',
          data: revenueByMonth,
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  // Call the getChartData function after the DOM has fully loaded
  getChartData();
};
}


/////////////// Sales report ////////////////////


const startDateInput = document.getElementById("start-date");
const endDateInput = document.getElementById("end-date");

const today = new Date().toISOString().split('T')[0];
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate());
const maxDate = tomorrow.toISOString().split('T')[0];

if(startDateInput && endDateInput){
startDateInput.setAttribute("max", maxDate);
endDateInput.setAttribute("min", startDateInput.value);
endDateInput.setAttribute("max", maxDate);
}

var startDateField = document.getElementById("start-date");
var endDateField = document.getElementById("end-date");

if(startDateField && endDateField){
startDateField.addEventListener("change", function () {
  endDateField.setAttribute("min", startDateField.value);
});

endDateField.addEventListener("change", function () {
  startDateField.setAttribute("max", endDateField.value);
});

}

let startDate
let endDate


const getSalesData = async() => {
    startDate = document.getElementById("start-date").value;
    endDate = document.getElementById("end-date").value;
    console.log(startDate, endDate);

    Handlebars.registerHelper("for", function (from, to, incr, block) {
        var accum = "";
        for (var i = from; i < to; i += incr) accum += block.fn(i);
        return accum;
    });

    const salesReportTemplate = `
<div class="col-xl-12">
  <!-- Account details card-->
  <div class="card mb-4">
    <div class="card-header">Sales Report 

    </div>

    <div class="card-body ml-3 p-5">
      <ul>   
        <table id="my-table" class="my-table table table-hover" style="border-top: 1px solid black;">
          <thead>
            <tr>
              <th scope="col">Date</th>
              <th scope="col">Order id</th>
              <th scope="col">Payment Method</th>
              <th scope="col">Product Details</th>
              <th scope="col">Total</th>
              
            </tr>
          </thead>
          <tbody>
            {{#each data.orders}}
            <tr>
              <td>{{this.date}}</td>
              <td>{{this.orderId}}</td>
              <td>{{this.paymentMethod}}</td> 
              <td>
                 {{#each this.productName}}
                 <p>Name: {{this.name}}</p>
                 <p>Quantity: {{this.quantity}}</p>
                 <p>Price: <span>₹</span>{{this.price}}</p>
                 {{/each}}
                 </td> 
            
              <td><span>₹</span>{{this.total}}</td> 
            </tr>
            {{/each}} 
          </tbody>
        </table>
                
        <h5>Total Revenue: ₹<strong class="ml-auto">{{data.grandTotal}}</strong>  </h5>
       
      </ul>
    </div>
  </div>
</div>
<div>
    <button onclick="downloadSalesReport()" class="btn btn-primary" >DOWNLOAD REPORT</button>
    </div>
`;

    function renderSalesReport(orderData) {
        const compiledTemplate = Handlebars.compile(salesReportTemplate);
        const salesReportHTML = compiledTemplate({ data: orderData });
        document.getElementById("table").innerHTML = salesReportHTML;

        jQuery(document).ready(function ($) {
            $("#my-table").DataTable({
                dom: "Bfrtip",
                buttons: ["excelHtml5", "pdfHtml5"],
            });
        });
    }


    ///////////sales report fetch///////////

    const response = await fetch(`/admin/getSales?startDate=${startDate}&endDate=${endDate}`, {
        headers: { "Content-Type": "application/json" },
    });

    orderData = await response.json();
    if (orderData) {
        renderSalesReport(orderData);
    }
}
 

const downloadSalesReport = async () => {
  try {
    const response = await fetch(`/admin/downloadSalesReport?startDate=${startDate}&endDate=${endDate}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orderData: orderData,
      }),
    });

    const blobData = await response.blob();
    console.log("blobbbbbb")
    const url = URL.createObjectURL(blobData);
    const link = document.createElement("a");
    link.href = url;
    link.download = `SalesReport.pdf`;
    link.click();

    URL.revokeObjectURL(url);
  } catch (error) {
    console.log(error.message);
  }
};
