import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IClient extends Document {
  _id: string;
  name: string;
  logo: string;
  website?: string;
  description?: string;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const clientSchema = new Schema<IClient>({
  name: {
    type: String,
    required: [true, 'Client name is required'],
    trim: true,
    maxlength: [100, 'Client name cannot exceed 100 characters']
  },
  logo: {
    type: String,
    required: [true, 'Client logo is required']
  },
  website: {
    type: String,
    trim: true,
    validate: {
      validator: function(v: string) {
        if (!v) return true;
        return /^https?:\/\/.+/.test(v);
      },
      message: 'Website must be a valid URL'
    }
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

clientSchema.index({ order: 1, isActive: 1 });

let Client: Model<IClient>;

try {
  Client = mongoose.model<IClient>('Client');
} catch {
  Client = mongoose.model<IClient>('Client', clientSchema);
}

export default Client;