const jwt = require("jsonwebtoken");
const { User } = require("../model/model");

// middleware là 1 bước chặn lại các req, nó đứng ở giữa client và controller
// middleware dùng để sử lý các yêu cầu request trước khi chúng đến được controller
// Chúng có thể can thiệp vào phản hồi (responses) trước khi gửi lại cho client
// Client -> Middleware -> Controller
// Khi thỏa mãn hết điều kiện ở trong middleware thì sẽ được đi tiếp đến Controller

const middlewareController = {
  // VerifyToken: Xác nhận Token
  verifyToken: (req, res, next) => {
    const token = req.headers.token;
    if (token) {
      // Bearer 123123123
      const accessToken = token.split(" ")[1];
      jwt.verify(accessToken, process.env.JWT_ACCESS_TOKEN, (err, user) => {
        if (err) {
          return res.status(403).json("Phiên người dùng đã hết");
        }
        req.user = user;
        next();
      });
    } else {
      return res.status(401).json("Bạn cần đăng nhập để truy cập");
    }
  },

  verifyTokenAndAdminAuth: (req, res, next) => {
    middlewareController.verifyToken(req, res, () => {
      if (req.user.id == req.params.id || req.user.isAdmin) {
        next();
      } else {
        return res.status(403).json("Bạn không thể xóa người khác");
      }
    });
  },

  authMiddleware: async (req, res, next) => {
    try {
      const token = req.headers.token;
      if (!token) {
        return res.status(401).json("Bạn cần đăng nhập để truy cập");
      }

      const accessToken = token.split(" ")[1];
      const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_TOKEN);

      // Tìm user hiện tại
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return res.status(401).json("Không tìm thấy người dùng");
      }

      // Gán user hiện tại vào request
      req.user = currentUser;
      next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json("Token đã hết hạn");
      }
      return res.status(401).json("Token không hợp lệ");
    }
  },
};

module.exports = middlewareController;
