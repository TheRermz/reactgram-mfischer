const User = require("../models/User");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const jwtSecret = process.env.JWT_SECRET;

// generate user token

const generateToken = (id) => {
  return jwt.sign({ id }, jwtSecret, { expiresIn: "7d" });
};
//register and sign in

const register = async (req, res) => {
  const { name, email, password } = req.body;
  // check if user exists
  const user = await User.findOne({ email });
  if (user) {
    res.status(422).json({ error: "Email já cadastrado" });
    return;
  }
  // generate pwd hash

  const salt = await bcrypt.genSalt();
  const pwdHash = await bcrypt.hash(password, salt);

  // create user
  const newUser = await User.create({
    name,
    email,
    password: pwdHash,
  });
  //if user was created, generate token
  if (!newUser) {
    res.status(422).json({ error: "Erro ao cadastrar usuário" });
    return;
  }
  res.status(201).json({ _id: newUser._id, token: generateToken(newUser._id) });
};
// sign user in
const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  //check if user exists
  if (!user) {
    res.status(404).json({ error: "Usuário não encontrado" });
    return;
  }
  // check if pwd matches
  if (!(await bcrypt.compare(password, user.password))) {
    res.status(422).json({ error: "Senha incorreta" });
    return;
  }
  res.status(201).json({
    _id: user._id,
    profilePic: user.profilePic,
    token: generateToken(user._id),
  });
};

// get current logged in user
const getCurrentUser = async (req, res) => {
  const user = req.user;
  res.status(200).json(user);
};
// update an user
const update = async (req, res) => {
  const { name, password, bio } = req.body;
  let profilePic = null;
  if (req.file) {
    profilePic = req.file.path;
  }

  const reqUser = req.user;

  const user = await User.findById(
    new mongoose.Types.ObjectId(reqUser._id)
  ).select("-password");

  if (name) {
    user.name = name;
  }

  if (password) {
    //generate pwd hash
    const salt = await bcrypt.genSalt();
    const pwdHash = await bcrypt.hash(password, salt);
    user.password = pwdHash;
  }

  if (profilePic) {
    user.profilePic = profilePic;
  }

  if (bio) {
    user.bio = bio;
  }
  await user.save();
  res.status(200).json(user);
};

// get user by id

const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id).select("-password");
    if (!user) {
      res.status(404).json({ error: "Usuário não encontrado" });
      return;
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(422).json({ error: "Usuário não encontrado" });
  }
  //check if user exists
};

module.exports = { register, login, getCurrentUser, update, getUserById };
