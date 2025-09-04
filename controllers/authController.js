const { body, validationResult, check } = require("express-validator");
const User = require("../models/user");

const bcrypt = require("bcryptjs");
const user = require("../models/user");

exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    isLoggedIn: false,
    errors: [],
    oldInput: { email: "" },
    user: {},
  });
};
exports.getSignup = (req, res, next) => {
  res.render("auth/signup", {
    isLoggedIn: false,
    errors: [],
    oldInput: { firstName: "", lastName: "", email: "", userType: "" },
    user: {},
  });
};

exports.postSignup = [
  // Validation middleware
  check("email").isEmail().withMessage("Please enter a valid email address."),

  check("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long."),

  // Controller logic
  (req, res, next) => {
    const { firstName, lastName, city, email, password, userType } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).render("auth/signup", {
        isLoggedIn: false,
        errors: errors.array(),
        oldInput: { firstName, lastName, email, password, userType },
        user: {},
      });
    }

    bcrypt.hash(password, 12).then((hashedPassword) => {
      const user = new User({
        firstName,
        lastName,
        city,
        email,
        password: hashedPassword,
        userType,
      });
      // console.log(user);
      user
        .save()
        .then(() => {
          console.log("saved successfully");
          res.redirect("/login");
        })
        .catch((err) => {
          return res.status(422).render("auth/signup", {
            isLoggedIn: false,
            errors: [err.message],

            oldInput: { firstName, lastName, email, userType },
            user: {},
          });
        });
    });
  },
];

exports.postLogin = async (req, res, next) => {
  // console.log(req.body);
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  console.log(user);

  if (!user) {
    return res.status(422).render("auth/login", {
      isLoggedIn: false,
      errors: ["User does not exist"],
      // oldInput: {email}
    });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(422).render("auth/login", {
      isLoggedIn: false,
      errors: ["Invalid password"],
      // oldInput:{email}
    });
  }
  console.log(user);

  req.session.isLoggedIn = true;
  req.session.user = user;
  await req.session.save();
  console.log(user);
  res.redirect("/");
};
exports.postLogout = (req, res, next) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
};

exports.postProfile = (req, res) => {
  const user = req.session.user;
  res.render("auth/profile", { isLoggedIn: req.isLoggedIn, user: user });
};
