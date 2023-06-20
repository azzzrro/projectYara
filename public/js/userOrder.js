//////////////// CHECKOUT MANAGEMENT ////////////////


/////////// Coupon Management ///////////

let coupon
let couponData
let couponDeleteSubtotal = null;

let subtotalElement = document.getElementById("subTotalValue");

if (subtotalElement) {
    couponDeleteSubtotal = Number(subtotalElement.value);
}

const inputField = document.getElementById("checkout-discount-input");

if (inputField) {
    inputField.addEventListener("input", function () {
        this.value = this.value.toUpperCase();
    });
}

function selectCoupon(code) {
    const inputField = document.getElementById("checkout-discount-input");
    inputField.value = code;
    inputField.style.backgroundColor = code ? "white" : "";
    // You can also perform additional actions with the discount value if needed
}

const validateCoupon = async () => {
    coupon = document.getElementById("checkout-discount-input").value;
    const subTotal = Number(document.getElementById("subTotalValue").value);

    const response = await fetch("/validateCoupon", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },

        body: JSON.stringify({
            coupon: coupon,
            subTotal: subTotal,
        }),
    });

    couponData = await response.json();
    console.log(couponData);

    const couponModel = document.getElementById("couponModel");
    const couponDiscount = document.getElementById("couponDiscount");
    const couponMessage = document.getElementById('couponMessage')

    const subTotalElement = document.getElementById("subTotal");
    const subTotalText = document.getElementById("subTotalText");


    if (couponData === "invalid") {
        Swal.fire({
            icon: "error",
            title: "INVALID COUPON CODE",
            showConfirmButton: true,
            confirmButtonText: "DISMISS",
            confirmButtonColor: "#4CAF50",
        });
    } else if (couponData === "expired") {
        Swal.fire({
            icon: "warning",
            title: "COUPON IS EXPIRED",
            showConfirmButton: true,
            confirmButtonText: "OK",
            confirmButtonColor: "#4CAF50",
        });
    } else if (couponData === "already used") {
        Swal.fire({
            icon: "warning",
            title: "ALREADY USED",
            showConfirmButton: true,
            confirmButtonText: "OK",
            confirmButtonColor: "#4CAF50",
        });
    } else if (couponData === "minimum value not met") {
        Swal.fire({
            icon: "warning",
            title: "COUPON CAN'T BE APPLIED",
            text: "We're sorry, the minimum order value to apply the coupon has not been met.",
            showConfirmButton: true,
            confirmButtonText: "OK",
            confirmButtonColor: "#4CAF50",
        });
    } else {
        if(couponData.maximum === "maximum" ) {
            Swal.fire({
                icon: "success",
                title: `"${coupon}" APPLIED SUCCESSFULLY!!`,
                html:`<strong>Maximum discount </strong>for this coupon is <strong style="color: green;" >₹ ${couponData.discountAmount}</strong>, and you have reached the maximum discount limit!`,
                showConfirmButton: true,
                confirmButtonText: "OK",
                confirmButtonColor: "#4CAF50",
            });
        }else{
            Swal.fire({
                icon: "success",
                title: `"${coupon}" APPLIED SUCCESSFULLY!!`,
                html: `You have received a discount of <strong style="color: green;" >₹ ${couponData.discountAmount}</strong>.<br>Enjoy your savings!`,
                showConfirmButton: true,
                confirmButtonText: "OK",
                confirmButtonColor: "#4CAF50",
            });
        }

        if(couponData.maximum === "maximum" ){
            couponMessage.innerHTML = "Maximum Coupon Discount:"
        }
        couponModel.style.display = "table-row";
        couponDiscount.innerHTML = `₹ ${couponData.discountAmount}`;

        subTotalElement.innerHTML = `₹ ${couponData.newTotal}`;
        subTotalText.innerHTML = "Total After Coupon Discount:";
        document.getElementById('subTotalValue').value = couponData.newTotal

        $('#couponIcon').removeClass('icon-long-arrow-right').addClass('fa-regular fa-trash-can p-1');

        $('#couponButton').attr('onclick', 'couponDelete()');
    };
}

couponDelete = async () => {

    const result = await Swal.fire({
        title: `Do you want to remove the coupon "${coupon}"?`,
        html:`By doing so, you will lose the discount amount <strong style="color: green;" >₹ ${couponData.discountAmount}</strong> associated with the coupon. Please confirm your decision`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33", 
        confirmButtonText: 'Yes, Remove',
        cancelButtonText: 'DISMISS'
        
    });

    if(result.value){

        const couponModel = document.getElementById("couponModel");
        const subTotalText = document.getElementById("subTotalText");
        const subTotalElement = document.getElementById("subTotal");
        const subTotalValue = document.getElementById("subTotalValue");

        couponModel.style.display = "none";
        subTotalText.innerHTML = "Grand Total:";
        subTotalElement.innerHTML = `₹ ${couponDeleteSubtotal}`;
        subTotalValue.value = couponDeleteSubtotal;

        $("#couponIcon").removeClass("fa-regular fa-trash-can p-1").addClass("icon-long-arrow-right");

        $("#couponButton").attr("onclick", "validateCoupon()");

        Swal.fire({
            icon: "success",
            title: `"${coupon}" REMOVED SUCCESSFULLY!!`,
            html: `The applied coupon has been successfully removed. The discount associated with the coupon has been removed as well`,
            showConfirmButton: true,
            confirmButtonText: "OK",
            confirmButtonColor: "#4CAF50",
        });
    }
    
}


/////////// Shipping selection ///////////

window.addEventListener("DOMContentLoaded", () => {
    const radio = document.getElementById("free-shipping");
    const checkoutBtn = document.getElementById("checkout-btn");
    const selectedShipping = localStorage.getItem("selectedShipping");

    if (radio) {
        if (selectedShipping === "free-shipping") {
            radio.checked = true;
            checkoutBtn.disabled = false;
        } else {
            radio.checked = false;
            checkoutBtn.disabled = true;
        }
    }
});

function handleShippingSelection(radio) {
    const checkoutBtn = document.getElementById("checkout-btn");
    if (radio.checked) {
        checkoutBtn.disabled = false;
        localStorage.setItem("selectedShipping", "free-shipping");
    } else {
        checkoutBtn.disabled = true;
        localStorage.removeItem("selectedShipping");
    }
}

/////////// Address selection ///////////

const addressRadios = document.querySelectorAll('input[name="selectedAddress"]');
const paymentRadios = document.querySelectorAll(".payment-radio");
const placeOrderBtn = document.getElementById("place-order-btn");


addressRadios.forEach((radio) => {
    radio.addEventListener("change", handleAddressSelection);
});

paymentRadios.forEach((radio) => {
    radio.addEventListener("change", handleAddressSelection);
});



function handleAddressSelection() {
    
    const selectedAddress = document.querySelector('input[name="selectedAddress"]:checked');
    const selectedPayment = document.querySelector(".payment-radio:checked");
    

    if (selectedAddress && selectedPayment) {
        placeOrderBtn.disabled = false;
    } else {
        placeOrderBtn.disabled = true;
    }

}


/////////// Order Management ///////////

const placeOrder = async()=>{
    try {

        const selectedPayment = document.querySelector(".payment-radio:checked").value;
        
        if(selectedPayment === "Cash On Delivery"){
            cashOnDelivery(selectedPayment)
        }
        else if(selectedPayment === "Razorpay"){
            razorpay(selectedPayment)
        }
        else if(selectedPayment === 'Wallet'){
            wallet(selectedPayment)
        }

        
    } catch (error) {
        console.log(error.message);
    }
}


const cashOnDelivery = async(selectedPayment, updatedBalance)=>{
    try {

        const selectedAddress = document.querySelector('input[name="selectedAddress"]:checked').value;
        const subTotal = Number(document.getElementById('subTotalValue').value)
        
        const response = await fetch('/placeOrder',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({

                selectedAddress: selectedAddress,
                selectedPayment: selectedPayment,
                amount: subTotal,
                walletBalance: updatedBalance,
                couponData: couponData,
                
              })
        })

        

        const orderConfirmData = await response.json()

        if(orderConfirmData.order ===  "Success"){

            window.location.href = '/orderSuccess'
            

        }       
        
    } catch (error) {
        console.log(error.message);
    }
}


const razorpay = async (selectedPayment)=>{
    try {

        const subTotal = Number(document.getElementById('subTotalValue').value)

        var options = {
            "key": "rzp_test_SvgHIkg1FQqxqX", // Enter the Key ID generated from the Dashboard
            "amount": subTotal * 100, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
            "currency": "INR",
            "name": "Yara SkinCare",
            "description": "Order payment",
            "image": "/assets/images/demos/demo-8/logo.png",
            "order_id": undefined, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
            "handler": function (response){
                cashOnDelivery(selectedPayment)
                console.log(response);
            },
            "theme": {
                "color": "#3399cc"
            }
        }

        var rzp1 = new Razorpay(options);
        
        rzp1.open();
        
    } catch (error) {
        console.log(error.message);
    }
}


const wallet = async(selectedPayment)=>{
    try {

        const balance = document.getElementById('userWallet').value
        const subTotal = Number(document.getElementById('subTotalValue').value)
        const insufficientBalanceAlert = document.getElementById('insufficientBalanceAlert');


        if(balance > subTotal){
            const updatedBalance = balance - subTotal
            cashOnDelivery(selectedPayment, updatedBalance )
        }else{
            insufficientBalanceAlert.classList.remove('d-none');
            insufficientBalanceAlert.classList.add('d-flex');
        }

        
    } catch (error) {
        console.log(error.message);
    }
}


window.addEventListener("load", function () {
    const insufficientBalanceAlert = document.getElementById("insufficientBalanceAlert");
    if (insufficientBalanceAlert) {
        insufficientBalanceAlert.classList.remove("d-flex");
        insufficientBalanceAlert.classList.add("d-none");
    }
});

const closeButton = document.querySelector(".btn-close");
if(closeButton){
    closeButton.addEventListener("click", function () {
        const insufficientBalanceAlert = document.getElementById("insufficientBalanceAlert");
        insufficientBalanceAlert.classList.remove("d-flex");
        insufficientBalanceAlert.classList.add("d-none");
    });
}


/////////// Order Filter ///////////

const orderFilterSelect = document.getElementById('sortby')

if (orderFilterSelect) {
    orderFilterSelect.addEventListener("change", async () => {
        const selectedOption = orderFilterSelect.value;
        if (selectedOption === "Most Recent") {
            location.reload();
        } else {
            try {
                const response = await fetch(`/orderFilter?status=${selectedOption}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                const data = await response.json();

                const paginationNav = document.getElementById("myOrdersPagination");
                paginationNav.innerHTML = "";

                const ordersTable = document.getElementById("ordersTable");
                ordersTable.innerHTML = "";

                data.forEach((order) => {
                    const row = document.createElement("tr");

                    const dateCell = document.createElement("td");
                    dateCell.textContent = order.date;
                    row.appendChild(dateCell);

                    const orderIdCell = document.createElement("td");
                    orderIdCell.textContent = order.orderId;
                    row.appendChild(orderIdCell);

                    const paymentMethodCell = document.createElement("td");
                    paymentMethodCell.textContent = order.paymentMethod;
                    row.appendChild(paymentMethodCell);

                    const totalCell = document.createElement("td");
                    totalCell.classList.add("price-col");
                    totalCell.textContent = `₹${order.total}`;
                    row.appendChild(totalCell);

                    const statusCell = document.createElement("td");
                    statusCell.style.color = getStatusColor(order.status);
                    statusCell.style.fontWeight = "600";
                    statusCell.textContent = order.status;
                    row.appendChild(statusCell);

                    const detailsCell = document.createElement("td");
                    const detailsLink = document.createElement("a");
                    detailsLink.style.fontWeight = "500";
                    detailsLink.href = `/orderDetails?orderId=${order._id}`;
                    detailsLink.classList.add("btn", "btn-link");
                    detailsLink.innerHTML = '<span>More Details</span><i class="icon-long-arrow-right"></i>';
                    detailsCell.appendChild(detailsLink);
                    row.appendChild(detailsCell);

                    ordersTable.appendChild(row);
                });
            } catch (error) {
                console.log(error.message);
            }
        }
    });
}

function getStatusColor(status) {
    switch (status) {
        case 'Pending':
            return 'orange';
        case 'Shipped':
            return 'green';
        case 'Delivered':
            return 'teal';
        case 'Cancelled':
            return 'red';
        case 'Returned':
            return 'purple';
        default:
            return 'black';
    }
}


/////////// Order cancel and Return ///////////

const returnOrder = async()=>{

    const orderId = document.getElementById('orderId').value

    const result = await Swal.fire({
        title: `Do you want to return this order?`,
        text: "For further assistance,\n contact our customer support team.\n We're here to help!",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33", 
        confirmButtonText: 'Yes, Return',
        cancelButtonText: 'DISMISS'
        
    });

    if(result.value){
        updateOrder(orderId, "Returned")
    }
}


const cancelOrder = async()=>{

    const orderId = document.getElementById('orderId').value

    const result = await Swal.fire({
        title: `Do you want to cancel this order?`,
        text: "For further assistance,\n contact our customer support team.\n We're here to help!",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33", 
        confirmButtonText: 'Yes, Cancel',
        cancelButtonText: 'DISMISS'
        
    });

    if(result.value){
        updateOrder(orderId, "Cancelled")
    }
}

const updateOrder = async (orderId, orderStatus)=>{
    try {

        const walletBalance = Number(document.getElementById('userWallet').value)
        const grandTotal = Number(document.getElementById('grandTotal').value)
        console.log(walletBalance);
        console.log(grandTotal);

        const updatedBalance = walletBalance + grandTotal
        
        const paymentMethod = document.getElementById('paymentMethod').innerHTML
        const response = await fetch(`/updateOrder?orderId=${orderId}`,{
            method:'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                orderStatus: orderStatus,
                paymentMethod: paymentMethod,
                wallet: updatedBalance,
                total: grandTotal
            })
        })

        const data = await response.json()

        const orderStatusBtn = document.getElementById('orderStatusBtn')

        if(data.message === "Cancelled"){
            const result = await Swal.fire({
                position: "center",
                icon: "success",
                title: "Your order has been successfully cancelled",
                text: "Your order has been cancelled.\n Any payment made will be refunded\n in your account within 7 business days.",
                showConfirmButton: true,
                confirmButtonColor: "#00A300",
            });

            if(result.value){

                console.log(data.refund)

                const expectedDate = document.getElementById('expectedDate')
                expectedDate.classList.add("d-none")


                orderStatusBtn.innerHTML= `<p class="disabled btn-product btn-cart icon-info-circle"><span>Order Cancelled</span></p>`
                
                    if(data.refund === "Refund"){
                        const refundMessage = document.getElementById('refundMessage');
                        refundMessage.classList.remove('d-none');
                    }else{
                        const refundMessage = document.getElementById("refundMessage");
                        refundMessage.classList.add("d-none");
                    }
            }

        }else if(data.message === "Returned"){
            const result = await Swal.fire({
                position: "center",
                icon: "success",
                title: "Successfully placed return request",
                text: "Return request received!.\n Our team will review it and\n provide further instructions",
                showConfirmButton: true,
                confirmButtonColor: "#00A300",
            });

            if(result.value){

                const expectedDate = document.getElementById('expectedDate')
                expectedDate.classList.add("d-none")

                orderStatusBtn.innerHTML=`<p  class="disabled btn-product btn-cart icon-info-circle"><span>Order Returned</span></p>`

                if(data.refund === "Refund"){
                    const refundMessage = document.getElementById('refundMessage');
                    refundMessage.classList.remove('d-none');
                }else{
                    const refundMessage = document.getElementById("refundMessage");
                    refundMessage.classList.add("d-none");
                }
            }

        }
        
    } catch (error) {
        console.log(error.message);
    }
}




const downloadInvoice = async (orderId)=>{
    try {

        const response = await fetch(`/downloadInvoice?orderId=${orderId}`,{
            method:'GET',
            headers:{
                'Content-Type': 'application/pdf'
            }
        })

        const blobData = await response.blob()
        const url = URL.createObjectURL(blobData)
        const link = document.createElement('a')
        link.href = url
        link.download = "Order-Invoive.pdf"
        link.click()
        
        URL.revokeObjectURL(url)
        
    } catch (error) {
        console.log(error.message);
    }
}