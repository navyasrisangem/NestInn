import mongoose from "mongoose";
// const { Schema } = mongoose;

const RoomSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    maxPeople: {
        type: Number,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    roomNumbers: [{number: Number, unavailableDates: {type: [Date]} }],
    hotelId: {  //  Add this field to link room to its hotel
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hotel",
        required: true
    }
}, {timestamps: true});



export default mongoose.model("Room", RoomSchema);