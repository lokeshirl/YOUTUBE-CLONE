import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const registerUser = asyncHandler(async (req, res, next) => {
  // get user details from frontend
  const { fullName, email, username, password } = req.body;

  // validations - throw error when empty fields
  if (
    [fullName, email, username, password].some(
      (fields) => fields === undefined || fields?.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required!");
  }

  // check if user already exist
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }

  // (+ multer) upload image: avatar and coverImage temporarily until images are sucessfully uploaded on cloudinary
  const avatarLocalPath = req.files?.avatar[0]?.path;
  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files?.coverImage[0]?.path;
  }

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required!");
  }

  // (+ cloudinary) upload upload image: avatar and coverImage on cloudinary
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Avatar file is required!");
  }

  // creating user object/document entry in database
  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while creating user");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User registered successfully"));
});

export { registerUser };

/** ########## TODOs FOR USER REGISTER CONTROLLER ########### *
 *
 * get user details from frontend ✅
 * validation - not empty ✅
 * check if user already exists: user, email ✅
 * check for images: check for avatar ✅
 * upload them on cloudinary: avatar ✅
 * create user object: create entry in db ✅
 * remove password and refresh field token from response ✅
 * check for user creation ✅
 * return res: response ✅
 *
 */
