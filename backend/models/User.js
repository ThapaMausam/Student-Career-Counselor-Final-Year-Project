import mongoose from "mongoose";

const { Schema } = mongoose;

const RecommendationSchema = new Schema(
  {
    datasetName: { type: String, required: true },
    prediction: { type: String, required: true },
    studentProfile: { type: Schema.Types.Mixed },
    timestamp: { type: Date, default: () => new Date() },
  },
  { _id: true }
);

const UserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    userType: { type: String, required: true },
    profile: { type: Schema.Types.Mixed },
    modelRegistration: {
      completed: { type: Boolean, default: false },
      attributes: { type: Schema.Types.Mixed },
    },
    recommendations: { type: [RecommendationSchema], default: [] },
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

export default User;
