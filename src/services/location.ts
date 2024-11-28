import { ICountry, IState, ICity } from "@/schemas/ilocation";

export const fetchToken = async (): Promise<string | null> => {
  const requestOptions = {
    method: "GET",
    headers: {
      Accept: "application/json",
      "api-token":
        "VZRqSoUfPdoEnzyMgPW1tVrHuhwNYcX0CZfoksSE61-79Tb0r-YgSF-oQDSAXJwwRSA",
      "user-email": "correopruebas086@gmail.com",
    },
  };
  try {
    const response = await fetch(
      "https://www.universal-tutorial.com/api/getaccesstoken",
      requestOptions
    );
    const result = await response.json();
    return result.auth_token;
  } catch (error) {
    console.error("Error fetching token:", error);
    return null;
  }
};

export const fetchCountries = async (token: string | null): Promise<ICountry[]> => {
  if (!token) return [];
  const url = "https://www.universal-tutorial.com/api/countries";
  return fetchLocationData<ICountry>(url, token);
};

export const fetchStates = async (
  country: string,
  token: string | null
): Promise<IState[]> => {
  if (!token) return [];
  const url = `https://www.universal-tutorial.com/api/states/${country}`;
  return fetchLocationData(url, token);
};

export const fetchCities = async (
  state: string,
  token: string | null
): Promise<ICity[]> => {
  if (!token) return [];
  const url = `https://www.universal-tutorial.com/api/cities/${state}`;
  return fetchLocationData(url, token);
};

export const fetchLocationData = async <T>(
  url: string,
  token: string | null
): Promise<T[]> => {
  if (!token) return [];
  const requestOptions = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  };
  try {
    const response = await fetch(url, requestOptions);
    const result = await response.json();
    return result;
  } catch (error) {
    console.error(`Error fetching from ${url}:`, error);
    return [];
  }
};
