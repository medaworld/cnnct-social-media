import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import passportLocalMongoose from 'passport-local-mongoose';

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  image: {
    url: {
      type: String,
      required: false,
    },
    id: {
      type: String,
      required: false,
    },
  },
  posts: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Post',
    },
  ],
  conversations: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Conversation',
    },
  ],
});

UserSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    await mongoose.model('Message').deleteMany({ sender: doc._id });
    await mongoose.model('Conversation').deleteMany({ participants: doc._id });
  }
});

UserSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', UserSchema);

export default User;
