import mongoose, { Document, Schema } from "mongoose";

export interface ICar extends Document {
  name: string;
  brand: string;
  carModel: string;
  year: number;
  engine: string;
  horsepower: number;
  torque: string;
  transmission: string;
  drivetrain: string;
  fuelType: string;
  maxSpeed: number;
  acceleration: string;
  weight: number;
  price: number;
  description: string;
  createdAt: Date;
}

const CarSchema = new Schema<ICar>(
  {
    name: { type: String, required: true, trim: true },
    brand: { type: String, required: true, trim: true },
    carModel: { type: String, required: true, trim: true },
    year: { type: Number, required: true },
    engine: { type: String, required: true },
    horsepower: { type: Number, required: true },
    torque: { type: String, required: true },
    transmission: { type: String, required: true },
    drivetrain: { type: String, required: true },
    fuelType: { type: String, required: true },
    maxSpeed: { type: Number, required: true },
    acceleration: { type: String, required: true },
    weight: { type: Number, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
  },
  { timestamps: true },
);

CarSchema.index({ brand: 1 });
CarSchema.index({ year: 1 });
CarSchema.index({ price: 1 });
CarSchema.index({ horsepower: 1 });
CarSchema.index({ name: "text", brand: "text", model: "text" });

export default mongoose.model<ICar>("Car", CarSchema);
