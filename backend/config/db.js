const mongoose = require("mongoose");
const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASS;

//conection to DB
const con = async () => {
  try {
    const dbCon = await mongoose.connect(
      `mongodb+srv://${dbUser}:${dbPass}@mfischer-cluster.vlpez1y.mongodb.net/`
    );
    console.log("DB connected");
    return dbCon;
  } catch (error) {
    console.log(error);
  }
};

con();

module.exports = con;
