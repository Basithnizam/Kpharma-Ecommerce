const mongoose = require('mongoose');

const { Schema, ObjectId } = mongoose;

const OrderSchema = new Schema({
  
  Products: [{
     ProductId: { type: Schema.Types.ObjectId, required: true },
     Quantrity: { type: Number, required: true },
  }],
  UserId: { type: Schema.Types.ObjectId, required: true },
  DeliveryAddress: {
     City: { type: String },
     ContactNumber: { type: Number, required: true },
     HouseName: { type: String, required: true },
     Locality: { type: String },
     PIN: { type: String, required: true },
     ReciverName: { type: String },
     State: { type: String, required: true },
  },
  PurchaseDate: { type: Date, required: true },
  PaymentStatus: { type: Boolean, required: true },
  PaymentMethod: { type: String, required: true },
  TimeStap: { type: Timestamp },
});

const order = mongoose.model('Order', OrderSchema);

module.exports =  order;