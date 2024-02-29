import { model, Schema } from "mongoose";
import { Ad } from "./adModel";
import { IUser } from "../interfaces/user";
import validator from "validator";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, `Username is mandatory`],
      unique: [true, `Username is already in use`],
      minLength: [3, `Username must contain 3 or more characters`],
      maxLength: [
        20,
        `The maximum number of characters allowed in username is 20`,
      ],
      validate: {
        validator: function (v: string) {
          return /^[a-zA-Z0-9\-]*$/.test(v);
        },
        message: () =>
          `The username can contain only letters, numbers and the hyphen(-)`,
      },
    },
    email: {
      type: String,
      required: [true, `Email is mandatory`],
      unique: [true, `Email is already in use`],
      validate: [validator.isEmail, `Invalid email format`],
      maxLength: [
        40,
        `The maximum number of characters allowed in email is 40`,
      ],
    },
    contact: {
      type: String,
      unique: [true, `Contact number is already in use`],
      maxLength: [
        30,
        `The maximum number of characters allowed in contact number is 30`,
      ],
      validate: {
        validator: function (v: string) {
          return /^[0-9\-\+\/().]*$/.test(v);
        },
        message: () => `Contact number can contain only numbers, +, /, ( and )`,
      },
    },
    password: {
      type: String,
      required: [true, `Password is mandatory`],
      select: false,
    },
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: `user`,
      select: false,
    },
    userType: {
      type: String,
      required: [true, `User Type is mandatory`],
      enum: ["Company", "Person"],
    },
    avatar: {
      avatarURL: {
        type: String,
        maxLength: [
          200,
          `The maximum number of characters allowed in avatar URL is 200`,
        ],
      },
      uploadedAvatar: {
        imageUrl: {
          type: String,
          maxLength: [
            200,
            `The maximum number of characters allowed in image URL is 200`,
          ],
        },
        publicID: {
          type: String,
          maxLength: [
            200,
            `The maximum number of characters allowed in image URL is 200`,
          ],
        },
      },
    },
    restartPasswordCode: { type: String, select: false },
    restartPasswordCodeExpire: { type: Date, select: false },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.virtual(`ads`, {
  ref: Ad,
  localField: "username",
  foreignField: "username",
});

const User = model<IUser>(`User`, userSchema);

export { User };
