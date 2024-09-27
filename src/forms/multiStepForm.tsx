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

interface MultiStepFormProps {
    step: number;
    nextStep: () => void;
    prevStep: () => void;
}

const MultiStepForm: React.FC<MultiStepFormProps> = ({
    step,
    nextStep,
    prevStep,
}) => {
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [token, setToken] = useState(null);
    const [countries, setCountries] = useState([]);
    
    // Estados separados para dirección
    const [addressStates, setAddressStates] = useState([]);
    const [addressCities, setAddressCities] = useState([]);

    // Estados separados para lugar de nacimiento
    const [birthplaceStates, setBirthplaceStates] = useState([]);
    const [birthplaceCities, setBirthplaceCities] = useState([]);

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

    // Función para obtener el token
    const fetchToken = async () => {
        const requestOptions = {
            method: "GET",
            headers: {
                Accept: "application/json",
                "api-token": "VZRqSoUfPdoEnzyMgPW1tVrHuhwNYcX0CZfoksSE61-79Tb0r-YgSF-oQDSAXJwwRSA",
                "user-email": "correopruebas086@gmail.com",
            },
        };
        try {
            const response = await fetch("https://www.universal-tutorial.com/api/getaccesstoken", requestOptions);
            const result = await response.json();
            setToken(result.auth_token);
        } catch (error) {
            console.error("Error fetching token:", error);
        }
    };

    // Reutilizable para obtener países, estados y ciudades
    const fetchLocationData = async (url, setter) => {
        if (!token) return;
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
            setter(result);
        } catch (error) {
            console.error(`Error fetching from ${url}:`, error);
        }
    };

    // Obtener países
    const fetchCountries = () => fetchLocationData("https://www.universal-tutorial.com/api/countries", setCountries);

    // Obtener estados de un país
    const fetchStates = (country, isAddress) => {
        const url = `https://www.universal-tutorial.com/api/states/${country}`;
        if (isAddress) {
            fetchLocationData(url, setAddressStates);
        } else {
            fetchLocationData(url, setBirthplaceStates);
        }
    };

    // Obtener ciudades de un estado
    const fetchCities = (state, isAddress) => {
        const url = `https://www.universal-tutorial.com/api/cities/${state}`;
        if (isAddress) {
            fetchLocationData(url, setAddressCities);
        } else {
            fetchLocationData(url, setBirthplaceCities);
        }
    };

    // Manejar cambios en la dirección
    const handleAddressChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            address: {
                ...prev.address,
                [name]: value,
            },
        }));

        if (name === "country") {
            fetchStates(value, true); // true para dirección
            setFormData((prev) => ({
                ...prev,
                address: { ...prev.address, state: "", city: "" }, // Resetea estado y ciudad
            }));
        } else if (name === "state") {
            fetchCities(value, true); // true para dirección
            setFormData((prev) => ({
                ...prev,
                address: { ...prev.address, city: "" }, // Resetea ciudad
            }));
        }
    };

    // Manejar cambios en el lugar de nacimiento
    const handleBirthPlaceChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            birthplace: {
                ...prev.birthplace,
                [name]: value,
            },
        }));

        if (name === "country") {
            fetchStates(value, false); // false para lugar de nacimiento
            setFormData((prev) => ({
                ...prev,
                birthplace: { ...prev.birthplace, state: "", city: "" }, // Resetea estado y ciudad
            }));
        } else if (name === "state") {
            fetchCities(value, false); // false para lugar de nacimiento
            setFormData((prev) => ({
                ...prev,
                birthplace: { ...prev.birthplace, city: "" }, // Resetea ciudad
            }));
        }
    };

    // Llamar la función para obtener países cuando se cargue el componente
    useEffect(() => {
        fetchToken();
    }, []);

    useEffect(() => {
        if (token) {
            fetchCountries();
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


    const validateStep = () => {
        const newErrors: { [key: string]: string } = {};

        // Validaciones para el primer paso
        if (step === 0) {
            if (!formData.username) {
                newErrors.username = "Se requiere un nombre de usuario";
            }
            if (!formData.email) {
                newErrors.email = "Se requiere un email";
            }
            if (formData.password.length < 6) {
                newErrors.password =
                    "La contraseña debe tener al menos 6 caracteres";
            }
            if (formData.confirmPassword !== formData.password) {
                newErrors.confirmPassword = "Las contraseñas deben coincidir";
            }
        }

        // Validaciones para el segundo paso
        if (step === 1) {
            if (!formData.name1) {
                newErrors.name1 = "Se requiere el primer nombre";
            }
            // Se pueden agregar más validaciones según sea necesario
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
            if (
                formData.birthDate &&
                new Date(formData.birthDate) > new Date()
            ) {
                newErrors.birthDate =
                    "La fecha de nacimiento no puede estar en el futuro";
            }
            if (!formData.gender) {
                newErrors.gender = "Se requiere seleccionar un género";
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

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (validateStep()) {
            // Concatenar los datos de address y birthplace como un solo string
            const formDataToSend = {
                ...formData,
                address: `${formData.address.street} ${formData.address.numberStreet} #${formData.address.number}, ${formData.address.city}, ${formData.address.state}, ${formData.address.country}`,
                birthplace: `${formData.birthplace.city}, ${formData.birthplace.state}, ${formData.birthplace.country}`,
            };
            console.log("Datos enviados:", formDataToSend);
        }
    };

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
                            fullWidth
                        />
                        <TextField
                            label="Primer apellido"
                            name="surname1"
                            variant="outlined"
                            value={formData.surname1}
                            onChange={handleChange}
                            fullWidth
                        />
                        <TextField
                            label="Segundo apellido"
                            name="surname2"
                            variant="outlined"
                            value={formData.surname2}
                            onChange={handleChange}
                            fullWidth
                        />
                    </>
                )}

                {step === 2 && (
                    <>
                        <TextField
                            label="DNI"
                            name="dni"
                            variant="outlined"
                            value={formData.dni}
                            onChange={handleChange}
                            required
                            fullWidth
                            error={!!errors.dni}
                            helperText={errors.dni}
                        />
                        {/* Dirección */}
                        <Typography variant="h6" component="h4" align="left">
                            Dirección
                        </Typography>
                        <TextField
                            select
                            label="País"
                            name="country"
                            variant="outlined"
                            value={formData.address.country}
                            onChange={handleAddressChange}
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
                            onChange={handleAddressChange}
                            required
                        >
                            {addressStates.length > 0 ? (
                                addressStates.map((state) => (
                                    <MenuItem
                                        key={state.state_name}
                                        value={state.state_name}
                                    >
                                        {state.state_name}
                                    </MenuItem>
                                ))
                            ) : (
                                <MenuItem disabled>
                                    Cargando estados...
                                </MenuItem>
                            )}
                        </TextField>

                        <TextField
                            select
                            label="Ciudad"
                            name="city"
                            variant="outlined"
                            value={formData.address.city}
                            onChange={handleAddressChange}
                            required
                        >
                            {addressCities.length > 0 ? (
                                addressCities.map((city) => (
                                    <MenuItem
                                        key={city.city_name}
                                        value={city.city_name}
                                    >
                                        {city.city_name}
                                    </MenuItem>
                                ))
                            ) : (
                                <MenuItem disabled>
                                    Cargando ciudades...
                                </MenuItem>
                            )}
                        </TextField>
                        <TextField
                            select
                            label="Tipo de vía"
                            name="street"
                            variant="outlined"
                            value={formData.address.street}
                            onChange={handleAddressChange}
                            required
                            fullWidth
                        >
                            <MenuItem value="Calle">Calle</MenuItem>
                            <MenuItem value="Carrera">Carrera</MenuItem>
                        </TextField>
                        <TextField
                            label="Número vía"
                            name="numberStreet"
                            variant="outlined"
                            value={formData.address.numberStreet}
                            onChange={handleAddressChange}
                            required
                        />
                        <Typography
                            variant="subtitle1"
                            component="h5"
                            align="left"
                        >
                            #
                        </Typography>
                        <TextField
                            label="Número"
                            name="number"
                            variant="outlined"
                            value={formData.address.number}
                            onChange={handleAddressChange}
                            required
                        />

                        {/* Lugar de Nacimiento */}
                        <Typography variant="h6" component="h4" align="left">
                            Lugar de Nacimiento
                        </Typography>
                        <TextField
                            select
                            label="País"
                            name="country"
                            variant="outlined"
                            value={formData.birthplace.country}
                            onChange={handleBirthPlaceChange}
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
                            onChange={handleBirthPlaceChange}
                            required
                        >
                            {birthplaceStates.length > 0 ? (
                                birthplaceStates.map((state) => (
                                    <MenuItem
                                        key={state.state_name}
                                        value={state.state_name}
                                    >
                                        {state.state_name}
                                    </MenuItem>
                                ))
                            ) : (
                                <MenuItem disabled>
                                    Cargando estados...
                                </MenuItem>
                            )}
                        </TextField>

                        <TextField
                            select
                            label="Ciudad"
                            name="city"
                            variant="outlined"
                            value={formData.birthplace.city}
                            onChange={handleBirthPlaceChange}
                            required
                        >
                            {birthplaceCities.length > 0 ? (
                                birthplaceCities.map((city) => (
                                    <MenuItem
                                        key={city.city_name}
                                        value={city.city_name}
                                    >
                                        {city.city_name}
                                    </MenuItem>
                                ))
                            ) : (
                                <MenuItem disabled>
                                    Cargando ciudades...
                                </MenuItem>
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
                        />
                        <FormControl fullWidth error={!!errors.gender}>
                            <InputLabel id="gender-label">Género</InputLabel>
                            <Select
                                labelId="gender-label"
                                name="gender"
                                value={formData.gender}
                                onChange={handleSelectChange}
                                required
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

                <div>
                    {step > 0 && <Button onClick={prevStep}>Atrás</Button>}
                    {step < 2 ? (
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
