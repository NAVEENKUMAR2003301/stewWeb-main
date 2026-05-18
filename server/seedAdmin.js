const mongoose = require("mongoose");
const User = require("./models/User");
require("dotenv").config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    // Remove any old admin first
    await User.deleteMany({ email: "livnaveen@gmail.com" });

    // Create a fresh admin
    await User.create({
      email: "your_new_livnaveen@gmail.com",
      password: "Admin@123",
    });

    console.log(
      "✅ Admin user created — email: livnaveen@gmail.com, password: Admin@123",
    );
    process.exit();
  })
  .catch((err) => {
    console.error("❌ Error creating admin:", err.message);
    process.exit(1);
  });
