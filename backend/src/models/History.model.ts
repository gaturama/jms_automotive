import mongoose, { Document, Schema } from "mongoose";

export interface IHistory extends Document {
  user: mongoose.Types.ObjectId;
  car: mongoose.Types.ObjectId;
  viewedAt: Date;
}

const HistorySchema = new Schema<IHistory>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  car: { type: Schema.Types.ObjectId, ref: "Car", required: true },
  viewedAt: { type: Date, default: Date.now },
});

HistorySchema.index({ user: 1, viewedAt: -1 });

export default mongoose.model<IHistory>("History", HistorySchema);
