const User = require("../model/User")

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

exports.signup = async (req, res) => {
  try {
    const checkEmail = await User.findOne({ email: req.body.email });
    if (checkEmail) {
      return res.json({ success: false, message: "Email already Exist" });
    }

    req.body.password = await bcrypt.hashSync(req.body.password);
    const user = await User.create(req.body);

    return res.json({
      data: user,
      success: true,
      message: "User Register Successfully",
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const checkEmail = await User.findOne({ email: req.body.email });
    if (!checkEmail) {
      return res.json({
        success: false,
        message: "we can not find your account",
      });
    }
    if (!bcrypt.compareSync(password, checkEmail.password)) {
      return res.json({ success: false, message: "Invalid Password" });
    } else {
      const token = jwt.sign(
        {
          id: checkEmail._id,
          email: checkEmail.email,
        },
        process.env.JWTSECRET,
        {
          expiresIn: 86400, // 1 day
        }
      );
      let result = {
        token: token,
        email: checkEmail.email,
      };
      return res.json({
        success: true,
        data: result,
        message: "Login successfully",
      });
    }
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
