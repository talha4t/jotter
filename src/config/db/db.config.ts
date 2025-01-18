import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(
            `${process.env.MONGODB_URI}/jotter`,
        );

        console.log(
            'DB connected successfully',
            connectionInstance.connection.host,
        );
    } catch (error) {
        console.log('MONGODB connection error ', error);

        process.exit(1);
    }
};

export default connectDB;
