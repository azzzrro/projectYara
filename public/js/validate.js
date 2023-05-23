$(document).ready(function () {
    
    //login form validate

    $("#login").validate({
        rules: {
            email: {
                required: true,
                email: true,
            },
            password: {
                required: true,
            },
        },
        messages: {
            email: {
                required: "",
                email: "Enter valid email address",
            },
            password: {
                required: "",
            },
        },
    });

    $("#login").submit(function (e) {
        if ($.trim($("#email").val()) === "" || $.trim($("#password").val()) === "") {
            e.preventDefault();
            $("#fillout2").show();
        } else if ($.trim($("#email").val()) && $.trim($("#password").val())) {
            $("#fillout2").hide();
        }
    });

    //signup form validate

    $("#signup").validate({
        rules: {
            name: {
                required: true,
            },
            mobile: {
                required: true,
                mbcheck: true,
            },

            password_signup: {
                required: true,
                pwcheck: true,
                minlength: 8,
            },
            re_password: {
                required: true,
            },
        },
        messages: {
            name: {
                required: "",
            },
            email: {
                required: "",
                email: "Enter valid email address",
            },
            mobile: {
                required: "",
                mbcheck: "Enter valid mobile number",
            },
            re_password: {
                required: "",
            },
            password_signup: {
                required: "",
                pwcheck: "One lower-case character & one digit",
            },
        },
    });

    $.validator.addMethod("pwcheck", function (value) {
        return (
            /^[A-Za-z0-9]*$/.test(value) && // consists of only these
            /[a-z]/.test(value) && // has a lowercase letter
            /\d/.test(value)
        ); // has a digit
    });


    $.validator.addMethod("mbcheck", function (value) {
        return /^(0|91)?[6-9][0-9]{9}$/.test(value); // consists of only these
    });


    $('#newPass').submit(function(e){
        const pass = $("#password").val();
        const pass2 = $("#new_password").val();
        if(pass2!==pass){
            e.preventDefault();
            $("#notmatch").show();
        }else{
            $("#notmatch").hide();
        }

    })



    $("#signup").submit(function (e) {
        if (
            $.trim($("#name").val()) === "" ||
            $.trim($("#email").val()) === "" ||
            $.trim($("#password_signup").val()) === "" ||
            $.trim($("#re_password").val()) === ""
        ) {
            e.preventDefault();
            $("#fillout").show();
        } else if (
            $.trim($("#name").val()) &&
            $.trim($("#email").val()) &&
            $.trim($("#password_signup").val()) &&
            $.trim($("#re_password").val())
        ) {
            $("#fillout").hide();

            var pass = $("#password_signup").val();
            var pass2 = $("#re_password").val();
            if (pass2 !== pass) {
                e.preventDefault();
                $("#notmatch").show();
            }
        }
    });


    $("#otpEnter").submit(function (e) {
        const otp = $.trim($("#otp").val());
        if (otp.length < 6 || otp === "") {
            e.preventDefault();
            $("#fillout2").show();
        } else {
            $("#fillout2").hide();
        }
    });


    $('#newPass').validate({
        rules:{
            password:{
                required:true,
                pwcheck:true,
                minlength:8
            },
            new_password:{
                required:true,
                pwcheck:true,
                minlength:8
            }
        },
        messages:{
            password:{
                required:"Please enter the password",
                pwcheck:"One lower-case character & one digit",
                minlength:"Atleast 8 characters"
            },
            new_password:{
                required:"Please enter the password",
                pwcheck:"One lower-case character & one digit",
                minlength:"Atleast 8 characters"
            }
        }
    })


    $('#userProfile').validate({
        rules:{
            userName:{
                required:true,               
            },
            userMobileNumber:{
                required:true,
                mbcheck:true
            },
            userEmail:{
                required:true,
                email:true
            },
            userCurrentPassword:{
                required:true,
                pwcheck:true,
                minlength:8
            }
            // ,
            // userNewPassword:{
                
            //     pwcheck:true,
            //     minlength:8
            // },
            // userConfirmNewPassword:{
                
            //     pwcheck:true,
            //     minlength:8
            // }
        },
        messages:{
            userName:{
                required:"please enter your name"                
            },
            userMobileNumber:{
                required:"please enter your mobile number",
                mbcheck:"please enter valid mobile number"
            },
            userEmail:{
                required:"please enter your email",
                email:"enter valid email address"
            },
            userCurrentPassword:{
                required:"Please enter your password",
                pwcheck:"Please enter valid password",
                minlength:""
            }
            // ,
            // userNewPassword:{
            //     pwcheck:"One lower-case character & one digit",
            //     minlength:"Atleast 8 characters"
            // },
            // userConfirmNewPassword:{
            //     pwcheck:"One lower-case character & one digit",
            //     minlength:"Atleast 8 characters"
            // }
        }
        
        
    })



    //Category Validation

    $("#categoryValidate").validate({
        rules: {
            name: {
                required: true,
                nameCheck: true,
            },
            categoryDescription:{
                required:true,
                CatDescCheck:true,
                
            }
        },
        messages: {
            name: {
                required: "Name is required",
                nameCheck: "Please enter a valid name",
            },
            categoryDescription:{
                required:"Description is required",
                CatDescCheck:"Please enter a valid description"
            }
        },
    });

    //Category update validation

    $("#updateCategoryValidate").validate({
        rules: {
            name: {
                required: true,
                nameCheck: true,
            },
            categoryDescription:{
                required:true,
                CatDescCheck:true,
                
            }
        },
        messages: {
            name: {
                required: "Name is required",
                nameCheck: "Please enter a valid Name",
            },
            categoryDescription:{
                required:"Description is required",
                CatDescCheck:"Please enter a valid description"
            }
        },
    });


    $.validator.addMethod("nameCheck", function (value) {
        return /^[a-zA-Z]{3,8}$/.test(value);
    });

    $.validator.addMethod("CatDescCheck", function (value) {
        return /^[a-zA-Z ]{3,100}$/.test(value);
    });



    //Product Validation

    $("#addProductValidation").validate({
        rules: {
            name: {
                required: true,
                productNameCheck: true,
            },
            price: {
                required: true,
                productPriceCheck: true,
            },
            quantity:{
                required:true,
                quantityCheck:true
            },
            description: {
                required: true,
                minlength: 5,
            },
            image: {
                required: true,
            },
        },
        messages: {
            name: {
                required: "Please enter a name",
                productNameCheck: "Please enter a valid name",
            },
            price: {
                required: "Please enter a price",
                productPriceCheck: "Please enter a valid price",
            },
            quantity:{
                required:"Please enter the quantity",
                quantityCheck:"Enter valid quantity"
            },
            description: {
                required: "Please enter product description",
                descriptionCheck: "Please enter valid description",
            },
            image: {
                required: "Please Select images",
            },
        },
    });

    $.validator.addMethod("productNameCheck", function (value) {
        return /^[a-zA-Z0-9& -]{3,60}$/.test(value);
    });

    $.validator.addMethod("productPriceCheck", function (value) {
        return /^[1-9]\d{0,3}$|^10000$/.test(value);
    });

    $.validator.addMethod("quantityCheck", function (value) {
        return /^(?:100|[1-9][0-9]?|[0-9])$/.test(value);
    });

    $.validator.addMethod("descriptionCheck", function (value) {
        return /^(?!\s)[a-zA-Z.()*]{5,}$/.test(value);
    });


    //Product update validation

    $("#updateProductValidation").validate({
        rules: {
            name: {
                required: true,
                productNameCheck: true,
            },
            price: {
                required: true,
                productPriceCheck: true,
            },
            quantity:{
                required:true,
                quantityCheck:true
            },
            description: {
                required: true,
                minlength: 5,
            },
            image: {
                required: false,
            },
        },
        messages: {
            name: {
                required: "Please enter a name",
                productNameCheck: "Please enter a valid name",
            },
            price: {
                required: "Please enter a price",
                productPriceCheck: "Please enter a valid price",
            },
            quantity:{
                required:"Please enter the quantity",
                quantityCheck:"Enter valid quantity"
            },
            description: {
                required: "Please enter product description",
                descriptionCheck: "Please enter valid description",
            },
        },
    });

    
});
