import Room from "../models/Room.js";
import Hotel from "../models/Hotel.js";
import { createError } from "../utils/error.js";

export const createRoom = async (req, res, next) => {
    const hotelId = req.params.hotelid;
    const newRoom = new Room({ ...req.body, hotelId });//  Add hotelId when creating

    try {
        const savedRoom = await newRoom.save();
        try {  //add the room to hotel
            await Hotel.findByIdAndUpdate(hotelId, {
                $push: { rooms: savedRoom._id },
            });
        } catch (err) {
            next(err);
        }
        res.status(200).json(savedRoom);
    } catch (err) {
        next();
    }
};

export const updateRoom = async (req, res, next) => {
    try {
        const updatedRoom = await Room.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true }); //find room by id and update it
        res.status(200).json(updatedRoom);
    } catch (err) {
        next(err);
    }
};

export const updateRoomAvailability = async (req, res, next) => {
    try {
        await Room.updateOne(
            { "roomNumbers._id": req.params.id },
            {
                $push: {
                    "roomNumbers.$.unavailableDates": req.body.dates
                },
            }
        );
        res.status(200).json("Room status has been updated.");
    } catch (err) {
        next(err);
    }
};

export const deleteRoom = async (req, res, next) => {

    try {
        const { id: roomId, hotelid: hotelId } = req.params;
        // console.log(roomId);
        // console.log(hotelId);
        // console.log(req.params);
        await Room.findByIdAndDelete(roomId);
        try {  //remove room from hotel
            await Hotel.findByIdAndUpdate(hotelId, {
                $pull: { rooms: roomId },
            }, { new: true });
        } catch (err) {
            next(err);
        }
        res.status(200).json("Room deleted!");
    } catch (err) {
        next(err);
    }
};

export const getRoom = async (req, res, next) => {
    try {
        const room = await Room.findById(req.params.id);
        res.status(200).json(room);
    } catch (err) {
        next(err);
    }
};

export const getRooms = async (req, res, next) => {
    try {
        const rooms = await Room.find().populate("hotelId", "_id name");  // Fetch `hotelId`
    
        res.status(200).json(rooms);
    } catch (err) {
        next(err);
    }
};