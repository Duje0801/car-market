import { model, Schema } from "mongoose";
import { IAd } from "../interfaces/ad";

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
        50,
        "The maximum number of characters allowed in the title is 50",
      ],
    },
    condition: {
      type: String,
      required: [true, "Condition is required"],
      enum: ["New", "Used"],
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
        "Hyundai",
        "Mercedes-Benz",
        "Opel",
        "Peugeot",
        "Renault",
        "Seat",
        "Skoda",
        "Suzuki",
        "Toyota",
        "Volkswagen",
        "Volvo",
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
      min: [
        1999,
        "First registration year must be from 2000 onwards or text - older",
      ],
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
    description: {
      type: String,
      maxLength: [
        300,
        "The maximum number of characters allowed in the car description is 300",
      ],
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

function arrayLimit(val: any) {
  return val.length <= 10;
}

const Ad = model<IAd>("Ad", adSchema);

export { Ad };
