import axios from 'axios';

export const isEmailValid = async (email: string): Promise<boolean> => {
    try {
        const API_KEY = process.env.ABSTRACT_API_KEY;

        const response = await axios.get(
            `https://emailvalidation.abstractapi.com/v1/?api_key=${API_KEY}&email=${email}`,
        );
        return response.data.deliverability === 'DELIVERABLE';
    } catch (error) {
        console.error('Error validating email:', error);
        return false;
    }
};
