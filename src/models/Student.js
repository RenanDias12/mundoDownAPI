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
    password: {
      type: Schema.Types.String,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

schema.pre("save", function (next) {
  var student = this;

  if (!student.isModified("password")) return next();

  bcrypt.genSalt(Number(process.env.SALT_WORK_FACTOR), function (err, salt) {
    if (err) return next(err);

    bcrypt.hash(student.password, salt, function (err, hash) {
      if (err) return next(err);

      student.password = hash;
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

const Student = model("Student", schema);
export { Student };
