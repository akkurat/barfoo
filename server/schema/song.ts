import { Schema, model, connect } from 'mongoose';

export interface ISong  {
  filename: string,
  name: string
  hash: string
  chromaprint: string
  path: string
  metaData: any
}
export const songSchema = new Schema<ISong>({
  filename: { type: String, unique: true },
  name: { type: String },
  hash: { type: String },
  chromaprint: { type: String },
  path: { type: String },
  metaData: Schema.Types.Mixed
});

export const Song = model<ISong>('Song', songSchema)