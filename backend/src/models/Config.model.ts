import mongoose, { Document, Schema } from "mongoose";

export interface Iconfig extends Document {
    spotifyPlaylistUrl: string;
    spotifyPlaylistName: string;
    updateAt: Date;
}

const ConfigSchema: Schema = new Schema<Iconfig>({
    spotifyPlaylistUrl: { type: String, default: "" },
    spotifyPlaylistName: { type: String, default: "Playlist JMS Showroom" },
}, { timestamps: true });

export default mongoose.model<Iconfig>("Config", ConfigSchema);