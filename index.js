const express = require("express");
const path = require("path");
const hbs = require("./helper/hbsHelper");
const app = express();
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const nocache = require("nocache");
const { v4: uuidv4 } = require("uuid");
const userRoute = require("./routes/userRoute");
const adminRoute = require("./routes/adminRoute");
const Category = require("./models/categoryModel");
require("dotenv").config();

const port = process.env.PORT;

app.set("view engine", "hbs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/assets", express.static(path.join(__dirname, "public/homeimages")));

app.use(
    session({
        secret: uuidv4(),
        saveUninitialized: true,
        cookie: { maxAge: 600000000 },
        resave: false,
    })
);

app.use(nocache());
app.use(logger("dev"));
app.use(cookieParser());

/////////////////for routes///////////////

app.use("/", userRoute);
app.use("/admin", adminRoute);

app.use(async function (req, res, next) {
    const userData = req.session.user;
    const categoryData = await Category.find({ is_blocked: false });
    res.status(404).render("users/404", { userData, categoryData });
});

app.listen(port, () => {
    console.log(`server running on http://localhost:${port}/`);
});
