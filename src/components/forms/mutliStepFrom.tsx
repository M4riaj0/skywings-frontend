import React, { useState, useEffect } from "react";

import {
  Button,
  Stack,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import { handleRegister } from "@/services/auth";
import { useRouter } from "next/navigation";
import { UserFormDataType } from '@/app/schemas/users'
import {fetchToken,fetchCountries,fetchStates,fetchCities} from '@/services/location'

interface MultiStepFormProps {
  step: number;
  nextStep: () => void;
  prevStep: () => void;
  user?: UserFormDataType;
}

const MultiStepForm: React.FC<MultiStepFormProps> = ({step, nextStep, prevStep, user}) => {
  const router = useRouter();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  //Token para la API de paises
  const [token, setToken] = useState(null);
  interface Country {
    country_name: string;
    country_short_name: string;
  }

  const [countries, setCountries] = useState<Country[]>([]);
  const [addressStates, setAddressStates] = useState<State[]>([]);
  const [addressCities, setAddressCities] = useState<City[]>([]);
  const [birthplaceStates, setBirthplaceStates] = useState<State[]>([]);
  const [birthplaceCities, setBirthplaceCities] = useState<City[]>([]);

  // Cambiar formato de birthplace y address para recibirlos desde un helper
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    name1: "",
    name2: "",
    surname1: "",
    surname2: "",
    dni: "",
    address: {
      country: "",
      state: "",
      city: "",
      street: "",
      numberStreet: "",
      number: "",
    },
    birthplace: {
      country: "",
      state: "",
      city: "",
    },
    birthDate: "",
    gender: "",
  });

  // Función para obtener el token de la API de paises
  const fetchToken = async () => {
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
      setToken(result.auth_token);
    } catch (error) {
      console.error("Error fetching token:", error);
    }
  };

  useEffect(() => {
    if (token) {
      const fetchCountriesData = async () => {
        const result = await fetchCountries(token); 
        setCountries(result);
      };
      fetchCountriesData();
    }
  }, [token]);

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, isAddress: boolean) => {
    const { name, value } = e.target;
  
    setFormData((prev) => ({
      ...prev,
      [isAddress ? 'address' : 'birthplace']: {
        ...prev[isAddress ? 'address' : 'birthplace'],
        [name]: value,
      },
    }));
  

    if (name === "country") {
      const locationType = isAddress ? 'address' : 'birthplace';
    
      fetchStates(value, token).then((states) => {
        if (isAddress) {
          setAddressStates(states);
        } else {
          setBirthplaceStates(states);
        }
      });

      setFormData((prev) => ({
        ...prev,
        [locationType]: { 
          ...prev[locationType], 
          state: "", 
          city: "" 
        },
      }));
    }else if (name === "state") {
      const locationType = isAddress ? 'address' : 'birthplace';

      fetchCities(value, token).then((cities) => {
        if (isAddress) {
          setAddressCities(cities);
        } else {
          setBirthplaceCities(cities);
        }
      });

      setFormData((prev) => ({
        ...prev,
        [locationType]: { 
          ...prev[locationType], 
          city: "" 
        },
      }));
    }
  };
  
  useEffect(() => {
    fetchToken();
  }, []);

  useEffect(() => {
    if (token) {
      fetchCountries(token);
    }
  }, [token]);

  //-----------------------
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors((prev) => ({ ...prev, [name]: "" })); // Limpiar el error al cambiar el valor
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors((prev) => ({ ...prev, [name]: "" })); // Limpiar el error al cambiar el valor
  };

  //sacar las validaciones a otro archivo, pasando el step
  const validateStep = () => {
    const newErrors: { [key: string]: string } = {};

    // Validaciones para el primer paso
    if (step === 0) {
      if (!formData.username) {
        newErrors.username = "Se requiere un nombre de usuario";
      } else if (formData.username.length < 3) {
        newErrors.username =
          "El nombre de usuario debe tener al menos 3 caracteres";
      }
      if (!formData.email) {
        newErrors.email = "Se requiere un email";
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
          newErrors.email = "El formato del email es incorrecto";
        }
      }
      if (formData.password.length < 6) {
        newErrors.password = "La contraseña debe tener al menos 6 caracteres";
      }
      if (formData.confirmPassword !== formData.password) {
        newErrors.confirmPassword = "Las contraseñas deben coincidir";
      }
    }

    // Validaciones para el segundo paso
    if (step === 1) {
      if (!formData.name1) {
        newErrors.name1 = "Se requiere el primer nombre";
      } else if (formData.name1.length < 3) {
        newErrors.name1 = "El nombre debe tener al menos 3 caracteres";
      }
      if (formData.name2 && formData.name2.length < 3) {
        newErrors.name2 = "El nombre debe tener al menos 3 caracteres";
      }
      if (formData.surname1 && formData.surname1.length < 3) {
        newErrors.surname1 = "El apellido debe tener al menos 3 caracteres";
      }
      if (formData.surname2 && formData.surname2.length < 3) {
        newErrors.surname2 = "El apellido debe tener al menos 3 caracteres";
      }
    }

    // Validaciones para el tercer paso
    if (step === 2) {
      if (!formData.dni) {
        newErrors.dni = "Se requiere el DNI";
      }
      if (!formData.address) {
        newErrors.address = "Se requiere una dirección";
      }
      if (!formData.birthplace) {
        newErrors.birthplace = "Se requiere el lugar de nacimiento";
      }
    }
    if (step == 3) {
      if (formData.birthDate) {
        const birthDate = new Date(formData.birthDate);
        const today = new Date();

        // Calcula la fecha de 18 años atrás desde hoy
        const eighteenYearsAgo = new Date(
          today.getFullYear() - 18,
          today.getMonth(),
          today.getDate()
        );

        // Verificar si la fecha de nacimiento es mayor que la de 18 años atrás
        if (birthDate > eighteenYearsAgo) {
          newErrors.birthDate = "Debes ser mayor de 18 años";
        } else if (birthDate > today) {
          newErrors.birthDate =
            "La fecha de nacimiento no puede estar en el futuro";
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Retorna true si no hay errores
  };

  const handleNext = () => {
    if (validateStep()) {
      nextStep(); // Solo avanza si las validaciones son exitosas
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateStep()) {
      // Concatenar los datos de address y birthplace como un solo string
      const formDataToSend = {
        ...formData,
        address: `${formData.address.street} ${formData.address.numberStreet} #${formData.address.number}, ${formData.address.city}, ${formData.address.state}, ${formData.address.country}`,
        birthPlace: `${formData.birthplace.city}, ${formData.birthplace.state}, ${formData.birthplace.country}`,
        birthDate: new Date(formData.birthDate),
      };
      const res = await handleRegister(formDataToSend);
      if (res === "Usuario registrado"){
        alert("Usuario registrado exitosamente");
        router.push("/auth/login");
      }
      else alert("Error al registrar el usuario");
    }
  };

  const checkUserInfo = () => {
    if (user) {
      setFormData({
        username: user.username || "",
        email: user.email || "",
        password: "",
        confirmPassword: "",
        name1: user.name1 || "",
        name2: user.name2 || "",
        surname1: user.surname1 || "",
        surname2: user.surname2 || "",
        dni: user.dni || "",
        address: {
          country: user.address?.country || "",
          state: user.address?.state || "",
          city: user.address?.city || "",
          street: user.address?.street || "",
          numberStreet: user.address?.numberStreet || "",
          number: user.address?.number || "",
        },
        birthplace: {
          country: user.birthplace?.country || "",
          state: user.birthplace?.state || "",
          city: user.birthplace?.city || "",
        },
        birthDate: user.birthDate || "",
        gender: user.gender || "",
      });
    }
  };

  useEffect(() => {
    checkUserInfo();
  }, [user]);

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <Stack spacing={2} className="w-full max-w-md">
        {step === 0 && (
          <>
            <TextField
              label="Nombre de usuario"
              name="username"
              variant="outlined"
              value={formData.username}
              onChange={handleChange}
              required
              fullWidth
              error={!!errors.username}
              helperText={errors.username}
            />
            <TextField
              label="Email"
              name="email"
              type="email"
              variant="outlined"
              value={formData.email}
              onChange={handleChange}
              required
              fullWidth
              error={!!errors.email}
              helperText={errors.email}
            />
            <TextField
              label="Contraseña"
              name="password"
              type="password"
              variant="outlined"
              value={formData.password}
              onChange={handleChange}
              required
              fullWidth
              error={!!errors.password}
              helperText={errors.password}
            />
            <TextField
              label="Confirmar contraseña"
              name="confirmPassword"
              type="password"
              variant="outlined"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              fullWidth
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
            />
          </>
        )}

        {step === 1 && (
          <>
            <TextField
              label="Primer nombre"
              name="name1"
              variant="outlined"
              value={formData.name1}
              onChange={handleChange}
              fullWidth
              error={!!errors.name1}
              helperText={errors.name1}
            />
            <TextField
              label="Segundo nombre"
              name="name2"
              variant="outlined"
              value={formData.name2}
              onChange={handleChange}
              error={!!errors.name2}
              fullWidth
            />
            <TextField
              label="Primer apellido"
              name="surname1"
              variant="outlined"
              value={formData.surname1}
              onChange={handleChange}
              error={!!errors.surname1}
              required
              fullWidth
            />
            <TextField
              label="Segundo apellido"
              name="surname2"
              variant="outlined"
              value={formData.surname2}
              onChange={handleChange}
              error={!!errors.surname2}
              required
              fullWidth
            />
            <TextField
              label="DNI"
              name="dni"
              type="number"
              variant="outlined"
              value={formData.dni}
              onChange={handleChange}
              required
              fullWidth
              error={!!errors.dni}
              helperText={errors.dni}
            />
            <FormControl fullWidth error={!!errors.gender}>
              <InputLabel id="gender-label">Género</InputLabel>
              <Select
                labelId="gender-label"
                name="gender"
                value={formData.gender}
                onChange={handleSelectChange}
              >
                <MenuItem value="">
                  <em>Seleccionar</em>
                </MenuItem>
                <MenuItem value="male">Masculino</MenuItem>
                <MenuItem value="female">Femenino</MenuItem>
                <MenuItem value="other">Otro</MenuItem>
              </Select>
              {errors.gender && <span>{errors.gender}</span>}
            </FormControl>
          </>
        )}

        {step === 2 && (
          <>
            <TextField
              select
              label="País"
              name="country"
              variant="outlined"
              value={formData.address.country}
              onChange={(e) => handleLocationChange(e, true)}
              required
            >
              {countries.length > 0 ? (
                countries.map((country) => (
                  <MenuItem
                    key={country.country_short_name}
                    value={country.country_name}
                  >
                    {country.country_name}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>Cargando países...</MenuItem>
              )}
            </TextField>

            <TextField
              select
              label="Estado"
              name="state"
              variant="outlined"
              value={formData.address.state}
              onChange={(e) => handleLocationChange(e, true)}
              required
              disabled={!formData.address.country}
            >
              {addressStates.length > 0 ? (
                addressStates.map((state) => (
                  <MenuItem key={state.state_name} value={state.state_name}>
                    {state.state_name}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>Cargando estados...</MenuItem>
              )}
            </TextField>

            <TextField
              select
              label="Ciudad"
              name="city"
              variant="outlined"
              value={formData.address.city}
              onChange={(e) => handleLocationChange(e, true)}
              disabled={!formData.address.state}
              required
            >
              {addressCities.length > 0 ? (
                addressCities.map((city) => (
                  <MenuItem key={city.city_name} value={city.city_name}>
                    {city.city_name}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>Cargando ciudades...</MenuItem>
              )}
            </TextField>
            <TextField
              select
              label="Tipo de vía"
              name="street"
              variant="outlined"
              value={formData.address.street}
              onChange={(e) => handleLocationChange(e, true)}
              disabled={!formData.address.city}
              required
              fullWidth
            >
              <MenuItem value="Calle">Calle</MenuItem>
              <MenuItem value="Carrera">Carrera</MenuItem>
            </TextField>
            <Stack direction="row" spacing={2} alignItems="center">
              <TextField
                label="Número vía"
                name="numberStreet"
                type="number"
                variant="outlined"
                value={formData.address.numberStreet}
                onChange={(e) => handleLocationChange(e, true)}
                disabled={!formData.address.street}
                required
              />
              <Typography variant="subtitle1" component="h5" align="left">
                #
              </Typography>
              <TextField
                label="Número"
                name="number"
                type="number"
                variant="outlined"
                value={formData.address.number}
                onChange={(e) => handleLocationChange(e, true)}
                disabled={!formData.address.numberStreet}
                required
              />
            </Stack>
          </>
        )}
        {step === 3 && (
          <>
            <TextField
              select
              label="País"
              name="country"
              variant="outlined"
              value={formData.birthplace.country}
              onChange={(e) => handleLocationChange(e, false)}
              required
            >
              {countries.length > 0 ? (
                countries.map((country) => (
                  <MenuItem
                    key={country.country_short_name}
                    value={country.country_name}
                  >
                    {country.country_name}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>Cargando países...</MenuItem>
              )}
            </TextField>

            <TextField
              select
              label="Estado"
              name="state"
              variant="outlined"
              value={formData.birthplace.state}
              onChange={(e) => handleLocationChange(e, false)}
              disabled={!formData.birthplace.country}
              required
            >
              {birthplaceStates.length > 0 ? (
                birthplaceStates.map((state) => (
                  <MenuItem key={state.state_name} value={state.state_name}>
                    {state.state_name}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>Cargando estados...</MenuItem>
              )}
            </TextField>

            <TextField
              select
              label="Ciudad"
              name="city"
              variant="outlined"
              value={formData.birthplace.city}
              onChange={(e) => handleLocationChange(e, false)}
              disabled={!formData.birthplace.state}
              required
            >
              {birthplaceCities.length > 0 ? (
                birthplaceCities.map((city) => (
                  <MenuItem key={city.city_name} value={city.city_name}>
                    {city.city_name}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>Cargando ciudades...</MenuItem>
              )}
            </TextField>
            <TextField
              label="Fecha de nacimiento"
              name="birthDate"
              type="date"
              variant="outlined"
              value={formData.birthDate}
              onChange={handleChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
              error={!!errors.birthDate}
              helperText={errors.birthDate}
              required
            />
          </>
        )}

        <div>
          {step > 0 && <Button onClick={prevStep}>Atrás</Button>}
          {step < 3 ? (
            <Button onClick={handleNext}>Siguiente</Button>
          ) : (
            <Button type="submit">Enviar</Button>
          )}
        </div>
      </Stack>
    </form>
  );
};

export default MultiStepForm;
