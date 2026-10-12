const express = require("express");
const app = express();
const cors = require("cors");

const { initializeDatabase } = require("./db/db.connect");
const Hotel = require("./models/hotel.models");

const corsOptions = {
  origin: [
    "http://localhost:5173",
   "https://bi-1-1-hw-1-nu.vercel.app"
],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

initializeDatabase();

//1. Create an API with route "/hotels" to create a new hotel data in the Database. Test your API with Postman.
async function createHotel(newHotel) {
    try {

        const hotel = new Hotel(newHotel);
        const savedHotel = await hotel.save();
        return savedHotel;
        
    } catch (error) {
        throw error
    }
}

app.post("/hotels", async(req, res) => {
    try {
        const savedHotel = await createHotel(req.body);
         res.status(201).json({message: "Hotel added successfully.", hotel: savedHotel})
    } catch (error) {
        res.status(500).json({error: "Failed to add Hotel"}) 
    }
})

async function readAllHotel() {
    try {
        const allHotels = await Hotel.find();
        return allHotels;
    } catch (error) {
        throw error;
    }
}

// 1. Create an API with route "/hotels" to read all hotels from the Database. Test your API with Postman.
app.get("/hotels", async (req, res) => {
    try {
        const hotels = await readAllHotel();

        if(hotels.length != 0) {
            res.status(200).json({message: "Hotels fetched successfully", data: hotels});
        } else {
            res.status(404).json({message: "No hotels found"}); 

        }

    } catch (error) {
        res.status(500).json({message: "Error fetching hotels", error: error.message });
    }
    
    });


async function readHotelByName(name) {
    try {
       const hotelByName = await Hotel.findOne({name: name});
       return hotelByName; 
    } catch (error) {
        throw error;
    }
}

// 2. Create an API with route "/hotels/:hotelName" to read a hotel by its name. Test your API with Postman.
app.get("/hotels/:hotelName", async (req, res) => {
    try {

        const hotel = await readHotelByName(req.params.hotelName);

        if(hotel.length != 0) {
            res.status(200).json({message: "Hotel fetched successfully", data: hotel});
        } else {
            res.status(404).json({message: "No hotel found"}); 
        }

    } catch {
        res.status(500).json({message: "Error fetching hotel", error: error.message });
    }
});

async function findHotelByNumber(number) {
    try {
        const hotelByNumber = await Hotel.findOne({phoneNumber: number});
        return hotelByNumber;
    } catch (error) {
        throw error;
    }
}

// 3. Create an API with route "/hotels/directory/:phoneNumber" to read a hotel by phone number. Test your API with Postman.
app.get("/hotels/directory/:phoneNumber", async(req, res) => {

    try {
        const hotel = await findHotelByNumber(req.params.phoneNumber);

        if( hotel != 0) {
             res.status(200).json({message: "Hotel fetched successfully", data: hotel});

        } else {
            res.status(404).json({message: "No hotel found"}); 
        }

    } catch {

         res.status(500).json({message: "Error fetching hotel", error: error.message });

    }
})


async function findHotelWithRating(rating) {
    try {
        const hotelWithRating = await Hotel.find({rating: rating});
        return hotelWithRating;
    } catch (error) {
        throw error;
    }
}

//4. Create an API with route "/hotels/rating/:hotelRating" to read all hotels by rating. Test your API with Postman.
app.get("/hotels/rating/:hotelRating", async(req, res) => {

    try {

        const hotel = await findHotelWithRating(req.params.hotelRating);

        if(hotel.length != 0) {
             res.status(200).json({message: "Hotel fetched successfully", data: hotel});
        } else {
            res.status(404).json({message: "No hotel found"}); 
        }

    } catch {
         res.status(500).json({message: "Error fetching hotel", error: error.message });
    }
});

async function findHotelWithCategory(category) {
    try {
        const hotelWithCategory = await Hotel.find({category : category});
        return hotelWithCategory;
    } catch (error) {
        throw error;
    }
}

// 5. Create an API with route "/hotels/category/:hotelCategory" to read all hotels by category. Test your API with Postman.
app.get("/hotels/category/:hotelCategory", async(req, res) => {

    try {
        const hotel = await findHotelWithCategory(req.params.hotelCategory);

        if(hotel.length != 0) {
            res.status(400).json({message: "Hotel fetched successfully", data: hotel});
        } else {
            res.status(404).json({message: "No hotel found"}); 
        }
    } catch (error) {
        res.status(500).json({message: "Error fetching hotel", error: error.message });
    }
})

// 1. Create an API with route "/hotels/:hotelId" to delete a hotel data by their ID in the Database. Test your API with Postman.
async function deleteHotel(hotelId) {
    try {
        const deletedHotel = await Hotel.findByIdAndDelete(hotelId);
        return deletedHotel;
    } catch (error) {
        console.log(error);
    }
}

app.delete("/hotels/:hotelId", async(req, res) => {
    try {
        const deletedHotel = await deleteHotel(req.params.hotelId);

        if(deletedHotel) {
            res.status(200).json({message: "Hotel deleted successfully."});
        }
    } catch (error) {
        res.status(500).json({error: "Failed to delete Hotel"})
    }
})

// 1. Create an API to update a hotel data by their ID in the Database. Update the rating of an existing hotel. Test your API with Postman.
async function updateHotel(hotelId, dataToUpdate) {
    try {
        const updatedHotel = await Hotel.findByIdAndUpdate(hotelId, dataToUpdate, {new: true});
        return updatedHotel
        
    } catch (error) {
        throw error
    }
}

app.post("/hotels/:hotelId", async(req, res) => {
    try {

        const updatedHotel = await updateHotel(req.params.hotelId, req.body);

        if(updatedHotel) {
            res.status(200).json({message: "Hotel updated successfully.", updatedHotel: updatedHotel});
        } else {
            res.status(404).json({error: "Hotel not found."});
        }
        
    } catch (error) {
        res.status(500).json({error: "Failed to update Hotel"});
    }
})

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port: http://localhost:${PORT}`);
});






