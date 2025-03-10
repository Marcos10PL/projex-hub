import mongoose from "mongoose";

const connect = url => mongoose.connect(url);

export default connect;