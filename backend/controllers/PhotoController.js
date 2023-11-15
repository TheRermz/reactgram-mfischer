const Photo = require("../models/Photo");
const mongoose = require("mongoose");
const User = require("../models/User");

// insert a photo with  an user related to it

const insertPhoto = async (req, res) => {
  const { title } = req.body;
  const image = req.file.filename;

  const reqUser = req.user;

  const user = await User.findById(reqUser._id);

  // create a photo

  const photo = await Photo.create({
    title,
    image,
    userId: user._id,
    userName: user.name,
  });

  // if photo was created successfully, return success response

  if (!photo) {
    res.status(422).json({ error: "Erro ao inserir foto" });
    return;
  }

  res.status(201).json({ photo });
};

// remove photo from db

const delPhoto = async (req, res) => {
  const { id } = req.params;
  const reqUser = req.user;
  try {
    const photo = await Photo.findById(new mongoose.Types.ObjectId(id));

    // check if photo exists
    if (!photo) {
      res.status(404).json({ error: "Foto não encontrada" });
      return;
    }

    // check if user is the owner of the photo
    if (!photo.userId.equals(reqUser._id)) {
      res.status(422).json({ error: "Acesso negado" });
      return;
    }

    await Photo.findByIdAndDelete(photo._id);

    res
      .status(200)
      .json({ id: photo._id, message: "Foto excluída com sucesso" });
  } catch (error) {
    res.status(404).json({ error: "Foto não encontrada" });
    return;
  }
};

// get all photos

const getAllPhotos = async (req, res) => {
  const photos = await Photo.find({})
    .sort([["createdAt", -1]])
    .exec();
  res.status(200).json({ photos });
};

// get user photo

const getUserPhotos = async (req, res) => {
  const { id } = req.params;
  const photos = await Photo.find({ userId: id })
    .sort([["createdAt", -1]])
    .exec();
  res.status(200).json({ photos });
};

// get photo by id

const getPhotoById = async (req, res) => {
  const { id } = req.params;
  const photo = await Photo.findById(id);
  if (!photo) {
    res.status(404).json({ error: "Foto não encontrada" });
    return;
  }
  res.status(200).json({ photo });
};

// update photo

const updatePhoto = async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const reqUser = req.user;

  try {
    const photo = await Photo.findById(new mongoose.Types.ObjectId(id));

    // check if photo exists
    if (!photo) {
      res.status(404).json({ error: "Foto não encontrada" });
      return;
    }

    // check if user is the owner of the photo
    if (!photo.userId.equals(reqUser._id)) {
      res.status(422).json({ error: "Acesso negado" });
      return;
    }

    // update photo
    photo.title = title;
    await photo.save();

    res.status(200).json({ photo, message: "Foto atualizada com sucesso!" });
  } catch (error) {
    res.status(404).json({ error: "Foto não encontrada" });
    return;
  }
};

// like Function

const likePhoto = async (req, res) => {
  const { id } = req.params;
  const reqUser = req.user;
  const photo = await Photo.findById(id);

  // check if photo exists
  if (!photo) {
    res.status(404).json({ error: "Foto não encontrada" });
    return;
  }

  // check if the user liked the photo already
  if (photo.likes.includes(reqUser._id)) {
    res.status(422).json({ error: "Você já curtiu esta foto" });
    return;
  }

  // put user id in the likes array
  photo.likes.push(reqUser._id);
  photo.save();
  res.status(200).json({
    photoId: id,
    userId: reqUser._id,
    message: "Foto curtida com sucesso!",
  });
};

// comment function

const commentPhoto = async (req, res) => {
  const { id } = req.params;
  const { comment } = req.body;
  const reqUser = req.user;
  const user = await User.findById(reqUser._id);
  const photo = await Photo.findById(id);

  // check if photo exists
  if (!photo) {
    res.status(404).json({ error: "Foto não encontrada" });
    return;
  }
  // put comment in the comments array
  const userComments = {
    comment,
    userName: user.name,
    userImage: user.profilePic,
    userId: user._id,
  };
  photo.comments.push(userComments);

  await photo.save();

  res.status(200).json({
    comment: userComments,
    message: "Comentário adicionado com sucesso!",
  });
};

// search photos by title
const searchPhotos = async (req, res) => {
  const { q } = req.query;

  const photos = await Photo.find({ title: new RegExp(q, "i") }).exec(); // i = case insensitive;

  res.status(200).json({ photos });
};

module.exports = {
  insertPhoto,
  delPhoto,
  getAllPhotos,
  getUserPhotos,
  getPhotoById,
  updatePhoto,
  likePhoto,
  commentPhoto,
  searchPhotos,
};
