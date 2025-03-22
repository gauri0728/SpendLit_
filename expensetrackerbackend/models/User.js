const mongoose = require('mongoose');

// Create User Schema
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
}
,
  { timestamps: true }
);

// module.exports = mongoose.model('User', UserSchema);
// module.exports = User;

const User = mongoose.model('User', UserSchema);

module.exports = User;
