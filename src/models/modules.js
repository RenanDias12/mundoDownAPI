import { Schema, model } from "mongoose";

const schema = new Schema(
  {
    _id: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    name: {
      type: Schema.Types.String,
      required: true,
    },
    startDate: {
      type: Schema.Types.Date,
      required: true,
    },
    tasks: {
      type: Schema.Types.Array,
      required: true,
    }
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Module = model("Module", schema);
export { Module };