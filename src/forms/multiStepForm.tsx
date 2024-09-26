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

    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);

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

    useEffect(() => {
        const fetchCountries = async () => {
            const requestOptions = {
                method: "GET",
                headers: {
                    Authorization:
                        "Bearer VZRqSoUfPdoEnzyMgPW1tVrHuhwNYcX0CZfoksSE61-79Tb0r-YgSF-oQDSAXJwwRSA",
                    Accept: "application/json",
                },
            }; 

            try {
                const response = await fetch(
                    "https://www.universal-tutorial.com/api/countries",
                    requestOptions
                );
                const result = await response.json();
                setCountries(result);
            } catch (error) {
                console.error("Error fetching countries:", error);
            }
        };

        fetchCountries();
    }, []);

    const fetchStates = async (country) => {
        const requestOptions = {
            method: "GET",
            headers: {
                Authorization:
                    "Bearer VZRqSoUfPdoEnzyMgPW1tVrHuhwNYcX0CZfoksSE61-79Tb0r-YgSF-oQDSAXJwwRSA",
                Accept: "application/json",
            },
        };

        try {
            const response = await fetch(
                `https://www.universal-tutorial.com/api/states/${country}`,
                requestOptions
            );
            const result = await response.json();
            setStates(result);
        } catch (error) {
            console.error("Error fetching states:", error);
        }
    };

    const fetchCities = async (state) => {
        const requestOptions = {
            method: "GET",
            headers: {
                Authorization:
                    "Bearer VZRqSoUfPdoEnzyMgPW1tVrHuhwNYcX0CZfoksSE61-79Tb0r-YgSF-oQDSAXJwwRSA",
                Accept: "application/json",
            },
        };

        try {
            const response = await fetch(
                `https://www.universal-tutorial.com/api/cities/${state}`,
                requestOptions
            );
            const result = await response.json();
            setCities(result);
        } catch (error) {
            console.error("Error fetching cities:", error);
        }
    };

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

    const handleAddressChange = (e) => {
        const { name, value } = e.target;

        setFormData((prevData) => ({
            ...prevData,
            address: {
                ...prevData.address,
                [name]: value,
            },
        }));

        if (name === "country") {
            fetchStates(value);
            setCities([]); // Limpiar ciudades cuando se selecciona un nuevo país
        } else if (name === "state") {
            fetchCities(value);
        }
    };

    const handleBirthplaceChange = (e) => {
        const { name, value } = e.target;

        setFormData((prevData) => ({
            ...prevData,
            birthplace: {
                ...prevData.birthplace,
                [name]: value,
            },
        }));

        if (name === "country") {
            fetchStates(value);
            setCities([]); // Limpiar ciudades cuando se selecciona un nuevo país
        } else if (name === "state") {
            fetchCities(value);
        }
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
            console.log("Datos enviados:", formData);
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
                            {states.length > 0 ? (
                                states.map((state) => (
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
                            {cities.length > 0 ? (
                                cities.map((city) => (
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
                            onChange={handleBirthplaceChange}
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
                            onChange={handleBirthplaceChange}
                            required
                        >
                            {states.length > 0 ? (
                                states.map((state) => (
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
                            onChange={handleBirthplaceChange}
                            required
                        >
                            {cities.length > 0 ? (
                                cities.map((city) => (
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
