import mongoose, { model, models, Schema } from "mongoose";

export const VIDEO_DIMENSTIONS = {
  width: 1080,
  height: 1920,
} as const;

export interface IVideo {
  _id: mongoose.Types.ObjectId;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  controls?: boolean;
  transformation?: {
    height: number;
    width: number;
    quality?: number;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

const videoSchema = new Schema<IVideo>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    videoUrl: { type: String, required: true },
    thumbnailUrl: { type: String, required: true },
    controls: { type: Boolean, default: true },
    transformation: {
      height: { type: Number, default: VIDEO_DIMENSTIONS.height },
      width: { type: Number, default: VIDEO_DIMENSTIONS.width },
      quality: { type: Number, minimum: 1, max: 100 },
    },
  },
  { timestamps: true }
);

// need to write models here as it will give
// list of all models that exists in mongoose instance
const Video = models?.User || model<IVideo>("Video", videoSchema);

export default Video;
