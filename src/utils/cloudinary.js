const cloudinary = require("cloudinary").v2;
const fs = require("fs");

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const uploadToCloudinary = async (localFilePath, folderName) => {
  try {
    // Upload Image to cloudanary
    const result = await cloudinary.uploader.upload(localFilePath, {
      folder: folderName || "Econ-User-Profile",
    });

    // Delete the file from the local filesystem
    fs.unlinkSync(localFilePath);

    console.log("result---->", result);

    return result.secure_url;
  } catch (error) {
    console.log("Eroor on uploading cloudinary", error);
    throw error;
  }
};

module.exports = uploadToCloudinary;
