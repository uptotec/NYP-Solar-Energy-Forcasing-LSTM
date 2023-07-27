import { Schema } from 'mongoose';

const farmSchema = new Schema({
  city: {
    type: Number,
    required: true,
  },
  singlePanelArea: {
    type: Number,
    required: true,
  },
  noOfPanels: {
    type: Number,
    required: true,
  },
  eff: {
    type: Number,
    required: true,
  },
});

export default farmSchema;
