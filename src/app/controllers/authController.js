// thư viện bcrypt dùng để hash dữ liệu thành 1 đoạn dữ liệu khác
const bcrypt = require("bcrypt");
const { User } = require("../model/model");
const jwt = require("jsonwebtoken");

let refreshTokens = [];

const authController = {
  // REGISTER USER
  registerUser: async (req, res) => {
    try {
      const {
        username,
        email,
        password,
        avatar,
        address,
        name,
        nickname,
        articles,
      } = req.body;

      // Check if username or password is missing
      if (!username || !password) {
        return res
          .status(400)
          .json("Username và password không được để trống!");
      }

      // Check if username length is between 5 and 24 characters
      if (username.length < 5 || username.length > 24) {
        return res
          .status(400)
          .json("Username phải có ít nhất 5 ký tự và nhiều nhất 24 ký tự!");
      }

      // Check if password length is less than 6 characters
      if (password.length < 5) {
        return res.status(400).json("Password phải có ít nhất 5 ký tự!");
      }

      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(password, salt);

      // Create new user
      const newUser = new User({
        username,
        email,
        password: hashed,
        avatar,
        address,
        name,
        nickname,
        articles,
      });

      const user = await newUser.save();
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // GENERATE ACCESS TOKEN
  generateAccessToken: (user) => {
    return jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_ACCESS_TOKEN,
      { expiresIn: "7d" }
    );
  },

  // GENERATE REFRESH TOKEN
  generateRefreshToken: (user) => {
    return jwt.sign(
      {
        id: user.id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_REFRESH_TOKEN,
      { expiresIn: "365d" }
    );
  },

  // LOGIN USER
  loginUser: async (req, res) => {
    try {
      const user = await User.findOne({ username: req.body.username });
      if (!user) {
        return res.status(400).json("Username sai hoặc không tồn tại!");
      }

      const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );

      if (!validPassword) {
        return res.status(400).json("Password sai hoặc không đúng!");
      }

      if (user && validPassword) {
        const accessToken = authController.generateAccessToken(user);
        const refreshToken = authController.generateRefreshToken(user);
        refreshTokens.push(refreshToken);
        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: false,
          path: "/",
          sameSite: "strict",
        });
        // what is user._doc ?
        const { password, ...others } = user._doc;
        res.status(200).json({ ...others, accessToken });
      }
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // dùng Redis để lưu refresh token
  requestRefreshToken: async (req, res) => {
    // Lấy refresh token từ user
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(401).json("Bạn chưa đăng nhập");
    if (!refreshTokens.includes(refreshToken))
      return res.status(401).json("Refresh không phải của tôi");
    jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN, (err, user) => {
      if (err) console.log(err);
      refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
      const newAccessToken = authController.generateAccessToken(user);
      const newRefreshToken = authController.generateRefreshToken(user);
      refreshTokens.push(newRefreshToken);
      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: false,
        path: "/",
        sameSite: "strict",
      });
      res.status(200).json({ accessToken: newAccessToken });
    });
  },

  // LOG OUT
  userLogout: async (req, res) => {
    res.clearCookie("refreshToken");
    refreshTokens = refreshTokens.filter(
      (token) => token !== req.cookies.refreshToken
    );
    res.status(200).json("Đăng xuất thành công");
  },
};

// STORE TOKEN: dùng để lưu
// 1. Dùng Local storage để lưu chữ token -> dễ bị tấn công
// - Bằng cách XSS, chạy 1 script trên web của mình  thì có thể lấy token

// 2. Dùng httponly cookies:
// - Ít bị ảnh hưởng bỏi XSS, lưu trữ token ở cookies
// - loại tấn công csrf sẽ ảnh hưởng đến -> samesite (khắc phục)

// 3. redux store -> accesstoken
//    httponly cookies -> refresh token

// BFF PPATTERN (BACKEND FOR FRONTEND)

// accessToken dùng để gắn vào phần header khi muốn verify token
// refreshToken để lưu trữ ở đâu đó, khi accessToken hết hạn thì refreshToken dùng để tạo accessToken mới
// nếu không có refreshToken thì người dùng sẽ phải đăng nhập lại để có 1 accessToken mới

module.exports = authController;
