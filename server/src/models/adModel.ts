import { model, Schema } from "mongoose";
import { IAd } from "../interfaces/ad";

function arrayLimit(val: any) {
  return val.length <= 10;
}

const adSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      minLength: [
        5,
        "The minimum number of characters allowed in the title is 5",
      ],
      maxLength: [
        30,
        "The maximum number of characters allowed in the title is 30",
      ],
    },
    condition: {
      type: String,
      required: [true, "Condition is required"],
      enum: ["New", "Used"],
    },
    make: {
      type: String,
      required: [true, "Make is required"],
      enum: [
        "Audi",
        "BMW",
        "Citroën",
        "Dacia",
        "Fiat",
        "Ford",
        "Mercedes-Benz",
        "Opel",
        "Peugeot",
        "Renault",
        "Skoda",
        "Volkswagen",
        "Other",
      ],
    },
    model: {
      type: String,
      required: [true, "Model is required"],
      minLength: [
        1,
        "The minimum number of characters allowed in the model name is 1",
      ],
      maxLength: [
        20,
        "The maximum number of characters allowed in the model name is 20",
      ],
    },
    firstRegistration: {
      type: Number,
      required: [true, "Year of first registration is required"],
      validate: {
        validator: function(value: number) {
          return value === 0 || (value >= 1999 && value <= new Date().getFullYear());
        },
        message: 'First registration year must be from 2000 onwards, -, or text `1999. and before`'
      },
      max: [
        new Date().getFullYear(),
        "This year is lastest possible year to choose",
      ],
    },
    mileage: {
      type: Number,
      required: [true, "Mileage is required"],
      min: [0, "The minimum milage number is 0"],
      max: [9999999, "The maximum milage number is 9999999"],
    },
    fuel: {
      type: String,
      required: [true, "Fuel type is required"],
      enum: ["Gasoline", "Diesel", "Hybrid", "LPG", "EV"],
    },
    gearbox: {
      type: String,
      required: [true, "Gearbox type is required"],
      enum: ["Manual", "Automatic", "Semi-Automatic"],
    },
    power: {
      type: Number,
      required: [true, "Engine power is required"],
      min: [1, "The minimum kW power number is 1"],
      max: [9999, "The maximum kW power number is 9999"],
    },
    price: {
      type: Number,
      required: [true, "The price of the car is required"],
      min: [1, "The minimum price is 1"],
      max: [99999999, "The maximum price is 99999999"],
    },
    location: {
      type: String,
      maxLength: [
        20,
        "The maximum number of characters allowed in the car location is 20",
      ],
    },
    country: {
      type: String,
      required: [true, "Country is required"],
      enum: [
        "Austria",
        "Belgium",
        "Croatia",
        "France",
        "Germany",
        "Italy",
        "Luxembourg",
        "Netherlands",
        "Slovenia",
        "Spain",
      ],
    },
    description: {
      type: String,
      maxLength: [
        1000,
        "The maximum number of characters allowed in the car description is 1000",
      ],
    },
    active: {
      type: Boolean,
      default: true,
    },
    visible: {
      type: Boolean,
      default: true,
    },
    images: {
      type: [
        {
          imageUrl: {
            type: String,
            required: true,
            maxLength: [
              200,
              `The maximum number of characters allowed in image URL is 200`,
            ],
          },
          publicID: {
            type: String,
            required: true,
            maxLength: [
              200,
              `The maximum number of characters allowed in public ID is 200`,
            ],
          },
        },
      ],
      required: [true, "Ad must have at least one image"],
      validate: [arrayLimit, "Maximum number of images per ad is 10"],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

adSchema.virtual(`user`, {
  ref: `User`,
  localField: "username",
  foreignField: "username",
});

const Ad = model<IAd>("Ad", adSchema);

export { Ad };
