import mongoose from "mongoose";

const MONGO_URI:string = process.env.MONGO_URI as string ;

mongoose.connect(MONGO_URI).then(() => {
    console.log("Connected to database");
    }
).catch((error) => {
    console.log("Error connecting to database", error);
}
);

export default mongoose;