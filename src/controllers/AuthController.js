const jwt = require("jsonwebtoken");
const response = require("../utils/util");
const GoogleAccount = require("../models/GoogleAccount");
require("dotenv").config();

const Key = process.env.SECRET_KEY;

function authenticateUser(req, res) {
  const encoded = jwt.sign({ userId: req.user.id }, Key);
  res.redirect(
    `https://main--velvety-crepe-d210ac.netlify.app/?token=${encoded}`
  );
}

async function LoginById(req, res) {
  try {
    const user = await GoogleAccount.findById(req.params.id);
    if (!user) {
      return res.status(404).json(response(404, "user not found"));
    }

    return res.status(200).json(
      response(200, "done", {
        fullname: user.fullname,
        email: user.email,
        profilePic: user.profilePic,
      })
    );
  } catch (err) {
    res.status(500).json(response(500, "Server Side Error"));
  }
}

// async function logout(req, res){
//         const

//         req.session.destroy((err) => {
//           if (err) {
//             console.log("Error destroying session:", err);
//           }
//           res.redirect("http://localhost:5173/login");
//         });
// }
module.exports = { LoginById, authenticateUser };
