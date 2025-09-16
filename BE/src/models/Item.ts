import mongoose, { Document, Schema } from 'mongoose';

export interface IItem extends Document {
  itemName: string;
  itemType: 'weapon' | 'armor' | 'consumable' | 'decoration' | 'special';
  itemPrice: number;
  itemImage: string;
  createdAt: Date;
  updatedAt: Date;
}

const ItemSchema: Schema = new Schema({
  itemName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  itemType: {
    type: String,
    enum: ['weapon', 'armor', 'consumable', 'decoration', 'special'],
    required: true
  },
  itemPrice: {
    type: Number,
    required: true,
    min: 0
  },
  itemImage: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Indexes
ItemSchema.index({ itemType: 1 });
ItemSchema.index({ itemPrice: 1 });
ItemSchema.index({ itemName: 1 });

export default mongoose.model<IItem>('Item', ItemSchema);
