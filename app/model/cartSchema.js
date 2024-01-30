const mongoose = require('mongoose');

const { Schema, ObjectId } = mongoose;

const CartSchema = new Schema({
  UserId: { type: Schema.Types.ObjectId, required: true, unique: true },
  Products: [{ 
    Products :{type: Schema.Types.ObjectId, required: true  },
    quantity : {type: Number, required: true }
}],
});

const cart = mongoose.model('cart', CartSchema);

module.exports = cart