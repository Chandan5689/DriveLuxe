import axios from "axios";
import { API_ENDPOINTS } from "../config/api";

export const getCars = async () => {
    const response = await axios.get(API_ENDPOINTS.CARS);
    return response.data;
}

const axiosInstance = (token) => axios.create({
  baseURL: API_ENDPOINTS.CARS.replace('/cars/', '/'),
  headers: {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Token ${token}` }),
  },
});
export default axiosInstance;

// function to get car by ID
export const getCarById = async (id) =>{
    const cars = await getCars()
    return cars.find(car => car.id === parseInt(id));
};

//function to filter cars by category
export const getCarsByCategory = async (category) =>{
    const cars = await getCars()
    if(!category || category === 'All') return cars;
    return cars.filter(car => car.category === category);
};

//Get all unique categories
export const getCategories = async ()=>{        
    const cars = await getCars()
    const categories = cars.map(car => car.category);
    return ['All',...new Set(categories)];
}

export const searchCars = async (query) =>{
    const cars = await getCars()
    if(!query) return cars

    const lowercaseQuery = query.toLowerCase();
    return cars.filter(car => car.name.toLowerCase().includes(lowercaseQuery) || car.category.toLowerCase().includes(lowercaseQuery) || car.description.toLowerCase().includes(lowercaseQuery)
    );
};