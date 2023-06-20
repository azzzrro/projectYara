////////////////CART & WISHLIST MANAGEMENT////////////////

const productQuantity = async (id, act) => {
    const elem = document.getElementById(id);
    if (act == "inc") elem.value ? (elem.value = Number(elem.value) + 1) : "";
    else if (act == "dec") elem.value > 1 ? (elem.value = Number(elem.value) - 1) : "";

    elem.setAttribute("value", elem.value);
};

const addToCart = async (productId) => {
    const addToCartButton = document.getElementById("addToCartBtn");
    const productName = document.getElementsByName("productName")[0].value;
    const quantity = document.getElementById(productId).value;

    const response = await fetch(`/addToCart?id=${productId}&quantity=${quantity}`, {
        method: "GET",
        headers: {
            "content-Type": "application/json",
        },
    });

    let data = await response.json();

    if (data.message === "Item already in cart!!") {
        Swal.fire({
            position: "center",
            icon: "success",
            title: "Product is already in cart.\n So quantity increased",
            showConfirmButton: true,
            confirmButtonColor: "#00A300",
        });
    } else {
        Swal.fire({
            position: "center",
            icon: "success",
            title: "Product successfully added to cart",
            showConfirmButton: true,
            confirmButtonColor: "#00A300",
        });
    }
};

const totalPrice = async (id, act, stock) => {
    const elem = document.getElementById(id);
    if (act == "inc") elem.value ? (elem.value = Number(elem.value) + 1) : "";
    else if (act == "dec") elem.value > 1 ? (elem.value = Number(elem.value) - 1) : "";

    let subTotal = 0;
    let datas = [];
    let length = document.getElementsByName("productTotal").length;
    for (let i = 0; i < length; i++) {
        const quantity = parseFloat(document.getElementsByName("num-product")[i].value);
        const price = parseFloat(document.getElementsByName("productprice")[i].value);
        const productTotal = isNaN(quantity) || isNaN(price) ? 0 : quantity * price;
        document.getElementsByName("productTotal")[i].innerText = "₹ " + productTotal.toFixed();
        subTotal += productTotal;

        datas.push({
            id: document.getElementsByName("productId")[i].value,
            quantity: Number(document.getElementsByName("num-product")[i].value),
        });
    }

    document.getElementById("subTotal").innerText = "₹ " + subTotal.toFixed();
    document.getElementById("subTotal2").innerText = "₹ " + subTotal.toFixed();

    let data = await fetch("/cartUpdation", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            datas,
        }),
    });
};

const removeCartalert = async (id) => {
    const productId = document.getElementById("product_id" + id).value;
    const cartId = document.getElementsByName("cart_id")[0].value;

    const idObj = { proId: productId, cartId: cartId };

    const result = await Swal.fire({
        title: "Remove item from cart",
        text: "Do you want to remove this\nproduct from your cart?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Move to wishlist",
        cancelButtonText: "Yes, remove",
    });

    // Handle the user's response
    if (result.value) {
        addToWishlist(productId, cartId);
    } else if (result.dismiss === Swal.DismissReason.cancel) {
        removeFromCart(productId, cartId);
    }
};

const addToWishlist = async (productId, cartId) => {
    const response = await fetch(`/addToWishlist?productId=${productId}&cartId=${cartId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    const data = await response.json();

    if (data.message === "Added to wishlist") {
        Swal.fire({
            position: "center",
            icon: "success",
            title: "Product added to wishlist",
            showConfirmButton: true,
            confirmButtonColor: "#00A300",
        });

        document.getElementById("row" + productId).innerHTML = "";
    } else {
        Swal.fire({
            position: "center",
            icon: "warning",
            title: "Product is already in wishlist!",
            showConfirmButton: true,
            confirmButtonColor: "#00A300",
        });
    }
};

const moveToCart = async (productId) => {
    try {
        const response = await fetch(`/addToCartFromWishlist?productId=${productId}`, {
            method: "GET",
            headers: {
                "content-Type": "application/json",
            },
        });

        const data = await response.json();

        if (data.message === "Moved to cart from wishlist") {
            Swal.fire({
                position: "center",
                icon: "success",
                title: "Product is moved to cart",
                showConfirmButton: true,
                confirmButtonColor: "#00A300",
            });
            document.getElementById("row" + productId).innerHTML = "";
        } else if (data.message === "Product is already in cart!!") {
            Swal.fire({
                position: "center",
                icon: "warning",
                title: "Product is already in cart",
                showConfirmButton: true,
                confirmButtonColor: "#00A300",
            });
        } else if (data.message === "Error Occured!") {
            Swal.fire({
                position: "center",
                icon: "warning",
                title: "Something error happened",
                showConfirmButton: true,
                confirmButtonColor: "#00A300",
            });
        }
    } catch (error) {
        console.log(error.message);
    }
};

const removeFromCart = async (productId, cartId) => {
    const response = await fetch(`/removeCart?productId=${productId}&cartId=${cartId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (response.ok) {
        Swal.fire({
            icon: "success",
            title: "Product has been removed successfully",
            showConfirmButton: true,
            confirmButtonText: "OK",
            confirmButtonColor: "#4CAF50",
        });
        document.getElementById("row" + productId).innerHTML = "";
    }
};

const removeFromWishlist = async (productId) => {
    const result = await Swal.fire({
        title: "Remove item from wishlist",
        text: "Do you want to remove this\nproduct from your wishlist?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, remove",
    });

    if (result.value) {
        const response = await fetch(`/removeWishlist?productId=${productId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (response.ok) {
            Swal.fire({
                icon: "success",
                title: "Product has been removed successfully",
                showConfirmButton: true,
                confirmButtonText: "OK",
                confirmButtonColor: "#4CAF50",
            });
            document.getElementById("row" + productId).innerHTML = "";
        } else {
            Swal.fire({
                icon: "warning",
                title: "Somthing error!!",
                showConfirmButton: true,
                confirmButtonText: "DISMISS",
                confirmButtonColor: "#D22B2B",
            });
        }
    }
};

const proceedToCheckout = async () => {
    const response = await fetch("/checkStock", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    const data = await response.json();

    if (data.message === "In stock") {
        window.location.href = "/checkout";
    } else {
        data.forEach((element) => {
            Swal.fire({
                icon: "error",
                title: `${element.name}\nis out of stock!!`,
                showConfirmButton: true,
                confirmButtonText: "CANCEL",
                confirmButtonColor: "#D22B2B",
            });
        });
    }
};

////////////////ADDRESS MANAGEMENT////////////////

///////////Add Address///////////

const addAddressBtn = document.getElementById("addAddressBtn");
const addAddressPanel = document.getElementById("addAddressPanel");

if (addAddressBtn) {
    addAddressBtn.addEventListener("click", function () {
        addAddressPanel.style.display = "block";
        editAddressPanel.style.display = "none";
    });
}

const addAddress = document.getElementById("addAddress");

if (addAddress) {
    addAddress.addEventListener("submit", async function (event) {
        event.preventDefault();

        const form = event.target;
        const formData = new FormData(form);

        if ($(form).valid()) {
            try {
                const response = await fetch("/addNewAddress", {
                    method: "POST",
                    body: JSON.stringify(Object.fromEntries(formData)),
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (response.ok) {
                    Swal.fire({
                        icon: "success",
                        title: "Successfully added new address",
                        showConfirmButton: true,
                        confirmButtonText: "OK",
                        confirmButtonColor: "#4CAF50",
                    });
                    addAddressPanel.style.display = "none";
                    form.reset();
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Some error occured",
                        showConfirmButton: true,
                        confirmButtonText: "CANCEL",
                        confirmButtonColor: "#D22B2B",
                    });
                }
            } catch (error) {
                console.log("Error:", error.message);
            }
        }
    });
}

const addAddressCheckout = document.getElementById("addAddressCheckout");

if (addAddressCheckout) {
    addAddressCheckout.addEventListener("submit", async function (event) {
        event.preventDefault();

        const form = event.target;
        const formData = new FormData(form);

        if ($(form).valid()) {
            try {
                const response = await fetch("/addNewAddress", {
                    method: "POST",
                    body: JSON.stringify(Object.fromEntries(formData)),
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (response.ok) {
                    const result = await Swal.fire({
                        icon: "success",
                        title: "Successfully added new address",
                        showConfirmButton: true,
                        confirmButtonText: "OK",
                        confirmButtonColor: "#4CAF50",
                    });
                    if (result.value) {
                        form.reset();
                        location.reload();
                    }
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Some error occured",
                        showConfirmButton: true,
                        confirmButtonText: "CANCEL",
                        confirmButtonColor: "#D22B2B",
                    });
                }
            } catch (error) {
                console.log("Error:", error.message);
            }
        }
    });
}

///////////Edit Address///////////

const editAddressBtns = document.querySelectorAll(".edit-address-btn");
const editAddressPanel = document.querySelector("#editAddressPanel");

const addressIdInput = document.getElementById("addressId");

const fullNameInput = document.querySelector(".full-name-input");
const mobileNumberInput = document.querySelector(".mobile-number-input");
const addressLineInput = document.querySelector(".address-line-input");
const emailInput = document.querySelector(".email-input");
const cityInput = document.querySelector(".city-input");
const stateInput = document.querySelector(".state-input");
const pincodeInput = document.querySelector(".pincode-input");

editAddressBtns.forEach((btn) => {
    btn.addEventListener("click", async (event) => {
        event.preventDefault();
        editAddressPanel.style.display = "block";
        addAddressPanel.style.display = "none";

        const addressId = btn.dataset.id;

        try {
            const response = await fetch(`/addressData?addressId=${addressId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json", // Adjust the content type based on your server's requirements
                    // Add any other headers if required
                },
            });

            if (response.ok) {
                const addressData = await response.json();

                // Populate the input fields with the received addressData

                addressIdInput.value = addressData._id;

                fullNameInput.value = addressData.name;
                mobileNumberInput.value = addressData.mobile;
                addressLineInput.value = addressData.addressLine;
                emailInput.value = addressData.email;
                cityInput.value = addressData.city;
                stateInput.value = addressData.state;
                pincodeInput.value = addressData.pincode;
            } else {
                console.log("Failed to fetch address data");
            }
        } catch (error) {
            console.log(error.message);
        }
    });
});

function scrollToForm() {
    // Delay for a certain duration (e.g., 500 milliseconds) before scrolling
    setTimeout(function () {
        // Calculate the offset of the target element
        const targetOffset = $("#editAddressPanel").offset().top;

        // Calculate the height of the window
        const windowHeight = $(window).height();

        // Calculate the final scroll position to scroll to the top of the target element
        const scrollPosition = targetOffset - windowHeight + $("#editAddressPanel").outerHeight();

        // Animate scrolling to the target element
        $("html, body").animate(
            {
                scrollTop: scrollPosition,
            },
            800
        ); // Adjust the animation speed as needed
    }, 300); // Adjust the delay duration as needed
}

function scrollToForm2() {
    // Delay for a certain duration (e.g., 500 milliseconds) before scrolling
    setTimeout(function () {
        // Calculate the offset of the target element
        const targetOffset = $("#addAddressPanel").offset().top;

        // Calculate the height of the window
        const windowHeight = $(window).height();

        // Calculate the final scroll position to scroll to the top of the target element
        const scrollPosition = targetOffset - windowHeight + $("#addAddressPanel").outerHeight();

        // Animate scrolling to the target element
        $("html, body").animate(
            {
                scrollTop: scrollPosition,
            },
            800
        ); // Adjust the animation speed as needed
    }, 300); // Adjust the delay duration as needed
}

const updateAddress = document.getElementById("updateAddress");

if (updateAddress) {
    updateAddress.addEventListener("submit", async function (event) {
        event.preventDefault();

        const form = event.target;
        const formData = new FormData(form);

        const addressId = document.getElementById("addressId").value;

        if ($(form).valid()) {
            try {
                const response = await fetch(`/updateAddress?addressId=${addressId}`, {
                    method: "POST",
                    body: JSON.stringify(Object.fromEntries(formData)),
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (response.ok) {
                    Swal.fire({
                        icon: "success",
                        title: "Successfully Updated address",
                        showConfirmButton: true,
                        confirmButtonText: "OK",
                        confirmButtonColor: "#4CAF50",
                    });
                    editAddressPanel.style.display = "none";
                    form.reset();
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Some error occured",
                        showConfirmButton: true,
                        confirmButtonText: "CANCEL",
                        confirmButtonColor: "#D22B2B",
                    });
                }
            } catch (error) {
                console.log("Error:", error.message);
            }
        }
    });
}

///////////Delete Address///////////

const deleteAddress = async (addressId) => {
    const result = await Swal.fire({
        title: "Delete Address",
        text: "Do you want to delete this address? \nThis cannot be undo!",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes,Delete",
        cancelButtonText: "DISMISS",
    });

    if (result.value) {
        try {
            const response = await fetch(`/deleteAddress?addressId=${addressId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                Swal.fire({
                    icon: "success",
                    title: "Address has been deleted successfully",
                    showConfirmButton: true,
                    confirmButtonText: "OK",
                    confirmButtonColor: "#4CAF50",
                });
                document.getElementById("addressCard" + addressId).innerHTML = "";
            } else {
                Swal.fire({
                    icon: "warning",
                    title: "Somthing error!!",
                    showConfirmButton: true,
                    confirmButtonText: "DISMISS",
                    confirmButtonColor: "#D22B2B",
                });
            }
        } catch (error) {
            console.log(error.message);
        }
    }
};



//////////////// FILTER AND SORT MANAGEMENT ////////////////


const productContainer = document.getElementById('productContainer')



const filteredData = (data) => {
    productContainer.innerHTML = '';
    productContainer.innerHTML = 
    `<div class="products mb-3"> 
        <div class="row justify-content-center" id="productList">
        </div><!-- End .row -->
    </div>`;
    const productList = document.getElementById('productList');
  
    data.forEach((product) => {
      productList.innerHTML +=
        `
          <div class="col-6 col-md-4 col-lg-4">
            <div class="product product-7 text-center">
              <figure class="product-media">
                ${product.stock ?
                  `<a href="/productView?id=${product._id}">
                    <img src="${product.imageUrl[0].url}" alt="Product image" class="product-image">
                  </a>
                  <div class="product-action-vertical">
                    <a href="#" class="btn-product-icon btn-wishlist btn-expandable"><span>add to wishlist</span></a>
                  </div><!-- End .product-action-vertical -->
                  <div class="product-action">
                    <a href="#" class="btn-product btn-cart"><span>add to cart</span></a>
                  </div><!-- End .product-action -->
                </figure><!-- End .product-media -->
                <div class="product-body">
                  <div class="product-cat">
                    <a href="#"></a>
                  </div><!-- End .product-cat -->
                  <h3 class="product-title"><a href="/productView?id=${product._id}">${product.name}</a></h3>
                  <!-- End .product-title -->
                  <div class="product-price">
                    ₹ ${product.price}
                  </div><!-- End .product-price -->` :
  
                  `<span class="product-label label-out">Out of Stock</span>
                  <a href="/productView?id=${product._id}">
                    <img src="${product.imageUrl[0].url}" alt="Product image" class="product-image">
                  </a>
                  <div class="product-action-vertical">
                    <a href="#" class="btn-product-icon btn-wishlist btn-expandable"><span>add to wishlist</span></a>
                  </div><!-- End .product-action-vertical -->
                  <div class="product-action">
                    <button style="border: none;" disabled="disabled" class="btn-product btn-cart"><span>add to cart</span></button>
                  </div><!-- End .product-action -->
                </figure><!-- End .product-media -->
                <div class="product-body">
                  <div class="product-cat"></div><!-- End .product-cat -->
                  <h3 class="product-title"><a href="/productView?id=${product._id}">${product.name}</a></h3>
                  <!-- End .product-title -->
                  <div class="product-price">
                    ₹ ${product.price}
                  </div><!-- End .product-price -->`
                }
                <div class="ratings-container">
                  <div class="ratings">
                    <div class="ratings-val" style="width: 80%;"></div><!-- End .ratings-val -->
                  </div><!-- End .ratings -->
                  <span class="ratings-text">( 6 Reviews )</span>
                </div><!-- End .rating-container -->
              </div><!-- End .product-body -->
            </div><!-- End .product -->
          </div><!-- End .col-sm-6 col-lg-4 -->`
    });
}
  


const categoryFilter = async (categoryId) =>{
    
    const response = await fetch(`/categoryFilter?categoryId=${categoryId}`,{
        headers: {
            "Content-Type": "application/json",
        },
    })

    const data = await response.json()

    if( data.length>0 ){
        filteredData(data)
    }else{
        productContainer.innerHTML = 
        
        `<div class="products mb-3" id="productList">
            <div class="row justify-content-center">

            
            <div class="col-6 col-md-4 col-lg-4">
                <div class="product product-7 text-center">
        
                    <div class="error-content text-center">
                        <div class="container">
                            <h1 class="error-title">Error 404</h1><!-- End .error-title -->
                            <p>We are sorry, the page you've requested is not available.</p>
                            <a href="/home" class="btn btn-outline-primary-2 btn-minwidth-lg">
                                <span>BACK TO HOMEPAGE</span>
                                <i class="icon-long-arrow-right"></i>
                            </a>
                        </div><!-- End .container -->
                    </div><!-- End .error-content text-center -->
                </div>
            </div>
            </div>
        </div>`

    }
}


const subCategoryFilter = async (subCategoryId) =>{
    
    const response = await fetch(`/subCategoryFilter?subCategoryId=${subCategoryId}`,{
        headers: {
            "Content-Type": "application/json",
        },
    })

    const data = await response.json()

    if( data.length>0 ){
        filteredData(data)
    }else{
        productContainer.innerHTML = 
        
        `<div class="products mb-3" id="productList">
            <div class="row justify-content-center">

            
            <div class="col-6 col-md-4 col-lg-4">
                <div class="product product-7 text-center">
        
                    <div class="error-content text-center">
                        <div class="container">
                            <h1 class="error-title">Error 404</h1><!-- End .error-title -->
                            <p>We are sorry, the page you've requested is not available.</p>
                            <a href="/home" class="btn btn-outline-primary-2 btn-minwidth-lg">
                                <span>BACK TO HOMEPAGE</span>
                                <i class="icon-long-arrow-right"></i>
                            </a>
                        </div><!-- End .container -->
                    </div><!-- End .error-content text-center -->
                </div>
            </div>
            </div>
        </div>`

    }
}


const brandFilter = async (brandId) =>{
    
    const response = await fetch(`/brandFilter?brandId=${brandId}`,{
        headers: {
            "Content-Type": "application/json",
        },
    })

    const data = await response.json()

    if( data.length>0 ){
        filteredData(data)
    }else{
        productContainer.innerHTML = 
        
        `<div class="products mb-3" id="productList">
            <div class="row justify-content-center">

            
            <div class="col-6 col-md-4 col-lg-4">
                <div class="product product-7 text-center">
        
                    <div class="error-content text-center">
                        <div class="container">
                            <h1 class="error-title">Error 404</h1><!-- End .error-title -->
                            <p>We are sorry, the page you've requested is not available.</p>
                            <a href="/home" class="btn btn-outline-primary-2 btn-minwidth-lg">
                                <span>BACK TO HOMEPAGE</span>
                                <i class="icon-long-arrow-right"></i>
                            </a>
                        </div><!-- End .container -->
                    </div><!-- End .error-content text-center -->
                </div>
            </div>
            </div>
        </div>`

    }
}

const sortProducts = async()=>{

    console.log("inside function");

    const selectElement = document.getElementById("sortOptions");
    const selectedValue = selectElement.value;

    if(selectedValue === 'relevent'){
        location.reload()
    }else{

        const response = await fetch('/sortProduct', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                sort: selectedValue,
            }),
        });

        const data = await response.json()
        filteredData(data)
    }   
}

