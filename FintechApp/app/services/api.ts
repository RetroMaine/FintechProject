import axios from 'axios';

// Use the tunnel URL when running on a physical device
const API_BASE_URL = __DEV__ 
  ? 'http://localhost:8000'  // For local development
  : 'http://10.165.172.169:8000'; // For physical device testing

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Define response types
interface CreditLimitResponse {
  predicted_limit: number;
}

interface ApprovalProbabilityResponse {
  approval_probability: number;
}

export const getCreditLimit = async (data: {
  Income: number;
  Rating: number;
  Cards: number;
  Age: number;
  Balance: number;
  Ethnicity: string;
}): Promise<CreditLimitResponse> => {
  try {
    const response = await api.post<CreditLimitResponse>('/limit/', data);
    return response.data;
  } catch (error) {
    console.error('Error getting credit limit:', error);
    throw error;
  }
};

export const getApprovalProbability = async (data: {
  Income: number;
  Rating: number;
  Cards: number;
  Age: number;
  Balance: number;
  Education: string;
  Student: string;
  Married: string;
  Ethnicity: string;
}): Promise<ApprovalProbabilityResponse> => {
  try {
    const response = await api.post<ApprovalProbabilityResponse>('/approval/', data);
    return response.data;
  } catch (error) {
    console.error('Error getting approval probability:', error);
    throw error;
  }
}; 