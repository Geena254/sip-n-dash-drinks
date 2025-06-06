// services/apiService.ts
const API_URL = 'https://barrush-backend.onrender.com/api';

let accessToken: string | null = null;

// Set token on login
export const setAccessToken = (token: string) => {
  accessToken = token;
};

const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
});

const fetchAPI = async (
  endpoint: string,
  method: string = 'GET',
  body?: any,
  isFormData = false
) => {
  const headers = isFormData
    ? { ...(accessToken && { Authorization: `Bearer ${accessToken}` }) }
    : getAuthHeaders();

  const res = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers,
    ...(body && (isFormData ? { body } : { body: JSON.stringify(body) })),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Error ${res.status}: ${error}`);
  }

  return res.status !== 204 ? await res.json() : null;
};

const fetchWithTimeout = (url, options, timeout = 8000) => {
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Request timeout')), timeout)
    )
  ]);
};

// ========== AUTH ==========
export const login = async (email: string, password: string) => {
  const res = await fetch(`${API_URL}/auth/login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  
  const data = await res.json();

  if (data.access) {
    setAccessToken(data.access);
  } else {
    throw new Error('Login failed');
  }

  return data;
};

// DRINKS CATEGORY
export const getDrinkCategories = () => fetchAPI('drinks-categories/');
export const createDrinkCategory = (data: FormData) => fetchAPI('drinks-categories/', 'POST', data, true);
export const updateDrinkCategory = (id: number, data: FormData) => fetchAPI(`drinks-categories/${id}/`, 'PATCH', data, true);
export const deleteDrinkCategory = (id: number) => fetchAPI(`drinks-categories/${id}/`, 'DELETE');

// COCKTAIL CATEGORY
export const getCocktailCategories = () => fetchAPI('cocktails-categories/');
export const createCocktailCategory = (data: FormData) => fetchAPI('cocktails-categories/', 'POST', data, true);
export const updateCocktailCategory = (id: number, data: FormData) => fetchAPI(`cocktails-categories/${id}/`, 'PATCH', data, true);
export const deleteCocktailCategory = (id: number) => fetchAPI(`cocktails-categories/${id}/`, 'DELETE');

// DRINKS
export const getDrinks = () => fetchAPI('drinks/');
export const createDrink = (data: FormData) => fetchAPI('drinks/', 'POST', data, true);
export const updateDrink = (id: number, data: FormData) => fetchAPI(`drinks/${id}/`, 'PATCH', data, true);
export const deleteDrink = (id: number) => fetchAPI(`drinks/${id}/`, 'DELETE');

// COCKTAILS
export const getCocktails = () => fetchAPI('cocktails/');
export const createCocktail = (data: FormData) => fetchAPI('cocktails/', 'POST', data, true);
export const updateCocktail = (id: number, data: FormData) => fetchAPI(`cocktails/${id}/`, 'PATCH', data, true);
export const deleteCocktail = (id: number) => fetchAPI(`cocktails/${id}/`, 'DELETE');

// CUSTOMER
export const getCustomers = () => fetchAPI('customers/');
export const createCustomer = (data: any) => fetchAPI('customers/', 'POST', data);
export const updateCustomer = (id: number, data: any) => fetchAPI(`customers/${id}/`, 'PATCH', data);
export const deleteCustomer = (id: number) => fetchAPI(`customers/${id}/`, 'DELETE');

// ORDER
export const getOrders = () => fetchAPI('orders/');
export const createOrder = (data: any) => fetchAPI('orders/', 'POST', data);
export const updateOrder = (id: number, data: any) => fetchAPI(`orders/${id}/`, 'PATCH', data);
export const deleteOrder = (id: number) => fetchAPI(`orders/${id}/`, 'DELETE');

// OFFER
export const getOffers = () => fetchAPI('offers/');
export const createOffer = (data: FormData) => fetchAPI('offers/', 'POST', data, true);
export const updateOffer = (id: number, data: FormData) => fetchAPI(`offers/${id}/`, 'PATCH', data, true);
export const deleteOffer = (id: number) => fetchAPI(`offers/${id}/`, 'DELETE');

// CONTACT
export const getContacts = () => fetchAPI('contacts/');
export const createContact = (data: any) => fetchAPI('contacts/', 'POST', data);
export const deleteContact = (id: number) => fetchAPI(`contacts/${id}/`, 'DELETE');
