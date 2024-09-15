import axios from 'axios';

interface Hospital {
    id: number;
    name: string;
    lat: number;
    lng: number;
    link: string; 
    size: number; 
    wifi: number;
    time: Date;  
}

const API_URL = 'https://localhost:8000/api/hospital';

export const fetchHospitalData = async (): Promise<Hospital[]> => {
  try {
    const response = await axios.get<Hospital[]>(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching hospital data:', error);
    throw error;
  }
};
