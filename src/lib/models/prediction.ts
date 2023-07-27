import { Schema, model, models } from 'mongoose';

const predictionSchema = new Schema(
  {
    city: {
      type: Number,
      required: true,
    },
    model: {
      type: Number,
      required: true,
    },
    predections: {
      type: [Number],
      required: true,
    },
    startPrediction: {
      type: Date,
      required: true,
    },
    step: {
      type: Number,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Prediction = models.Prediction || model('Prediction', predictionSchema);

export default Prediction;
