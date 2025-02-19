const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const articleRouter = require("./routes/article");
const genreRouter = require("./routes/genre");
const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");

const db = require("./config/connect");
const app = express();
const port = 8080;

app.use(morgan("combined"));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(bodyParser.json({ limit: "50mb" }));

// CONNECT DATABASE
db.connect();

// ROUTES
app.use("/api/article", articleRouter);
app.use("/api/genre", genreRouter);
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

app.listen(port, () => {
  console.log(`App listening on port localhost:${port}`);
});

// authentication
// authorization: phân quyền
// JWT: Xác thực người dùng, tạo 1 token cho tài khoản khi đăng nhập vào
