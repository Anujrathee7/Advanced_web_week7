import { Model,model,Document,Schema } from "mongoose";

interface IUser extends Document {
  email: string,
  password: string
}

const UserSchema: Schema<IUser> = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const User: Model<IUser> = model<IUser>('User', UserSchema);

export {User, IUser};
