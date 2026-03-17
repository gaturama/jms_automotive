import mongoose, { Document, Schema } from "mongoose";

export interface IFavorite extends Document {
  user: mongoose.Types.ObjectId;
  car: mongoose.Types.ObjectId;
  createdAt: Date;
}

const FavoriteSchema = new Schema<IFavorite>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    car: { type: Schema.Types.ObjectId, ref: "Car", required: true },
  },
  { timestamps: true },
);

FavoriteSchema.index({ user: 1, car: 1 }, { unique: true });

export default mongoose.model<IFavorite>("Favorite", FavoriteSchema);
