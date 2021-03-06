import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";

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
    email: {
      type: Schema.Types.String,
      required: true,
    },
    age: {
      type: Schema.Types.Number,
      required: false,
    },
    fone: {
      type: Schema.Types.String,
      required: false,
    },
    password: {
      type: Schema.Types.String,
      required: true,
    },
    studentIds: {
      type: Schema.Types.Array,
      required: false,
    }
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

schema.pre("save", function (next) {
  var teacher = this;

  if (!teacher.isModified("password")) return next();

  bcrypt.genSalt(Number(process.env.SALT_WORK_FACTOR), function (err, salt) {
    if (err) return next(err);

    bcrypt.hash(teacher.password, salt, function (err, hash) {
      if (err) return next(err);

      teacher.password = hash;
      next();
    });
  });
});

schema.methods.comparePassword = function (candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function (err, isValid) {
    if (err) return cb(err);

    cb(null, isValid);
  });
};

const Teacher = model("Teacher", schema);
export { Teacher };
