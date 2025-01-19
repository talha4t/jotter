import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    isVerified: boolean;

    verificationPin: string;
    resetPasswordPin: string;
    resetPasswordExpires?: Date;
    refreshToken?: string;

    createdAt: Date;
    updatedAt: Date;
}

const UserSchema: Schema = new Schema<IUser>(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, trim: true },
        password: { type: String, required: true },
        isVerified: { type: Boolean, default: false },
        verificationPin: { type: String },
        resetPasswordPin: { type: String },
        resetPasswordExpires: { type: Date },
        refreshToken: { type: String },
    },
    { timestamps: true },
);

const User = mongoose.model<IUser>('User', UserSchema);
export default User;
