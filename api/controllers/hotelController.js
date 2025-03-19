import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";

export const createHotel = async (req, res, next) => {
    const newHotel = new Hotel(req.body); //Hotel model where we are taking request from user

    try {
        const savedHotel = await newHotel.save();
        res.status(200).json(savedHotel);
    } catch (err) {
        next(err);
    }
};

export const updateHotel = async (req, res, next) => {
    try {
        const updatedHotel = await Hotel.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true }); //find hotel by id and update it
        res.status(200).json(updatedHotel);
    } catch (err) {
        next(err);
    }
};

export const deleteHotel = async (req, res, next) => {
    try {
        await Hotel.findByIdAndDelete(req.params.id);
        res.status(200).json("Hotel deleted!");
    } catch (err) {
        next(err);
    }
};
export const getHotel = async (req, res, next) => {
    try {
        const hotel = await Hotel.findById(req.params.id);
        res.status(200).json(hotel);
    } catch (err) {
        next(err);
    }
};
export const getHotels = async (req, res, next) => {
    const { min, max, limit, featured, city, ...others } = req.query;
    try {
        let query = { ...others };
        if (city) {
            query.city = { $regex: new RegExp(city, 'i') }; 
        }
        if (min || max) {
            query.cheapestPrice = {
                $gt: min || 1,
                $lt: max || 99999
            };
        }
        if (featured) {
            query.featured = featured === 'true'; 
        }

        const hotels = await Hotel.find(query).limit(limit ? parseInt(limit) : 10);
        
        res.status(200).json(hotels);
    } catch (err) {
        next(err);
    }
};  
export const countByCity = async (req, res, next) => {
    const cities = req.query.cities.split(",");
    try {
        const list = await Promise.all(cities.map(city => {
            return Hotel.countDocuments({ city: city });
        }));
        res.status(200).json(list);
    } catch (err) {
        next(err);
    }
};
export const countByType = async (req, res, next) => {
    try {
        const hotelCount = await Hotel.countDocuments({ type: "hotel" });
        const apartmentCount = await Hotel.countDocuments({ type: "apartment" });
        const resortCount = await Hotel.countDocuments({ type: "resort" });
        const villaCount = await Hotel.countDocuments({ type: "villa" });
        const cabinCount = await Hotel.countDocuments({ type: "cabin" });
        res.status(200).json([
            { type: "hotels", count: hotelCount },
            { type: "apartments", count: apartmentCount },
            { type: "resorts", count: resortCount },
            { type: "villas", count: villaCount },
            { type: "cabins", count: cabinCount },
        ]);
    } catch (err) {
        next(err);
    }
};
export const getHotelRooms = async (req, res, next) => {
    try {
      const hotel = await Hotel.findById(req.params.id);
      const list = await Promise.all(
        hotel.rooms.map((room) => {
          return Room.findById(room);
        })
      );
      res.status(200).json(list);
    } catch (err) {
      next(err);
    }
  };