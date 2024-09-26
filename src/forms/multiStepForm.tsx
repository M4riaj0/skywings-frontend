import React, { useState } from "react";
import { Button, Stack, TextField, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from "@mui/material";

interface MultiStepFormProps {
  step: number;
  nextStep: () => void;
  prevStep: () => void;
}

const MultiStepForm: React.FC<MultiStepFormProps> = ({ step, nextStep, prevStep }) => {
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
    address: "",
    birthplace: "",
    birthDate: "",
    gender: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

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
      if (formData.birthDate && new Date(formData.birthDate) > new Date()) {
        newErrors.birthDate = "La fecha de nacimiento no puede estar en el futuro";
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
            <TextField
              label="Dirección"
              name="address"
              variant="outlined"
              value={formData.address}
              onChange={handleChange}
              required
              fullWidth
              error={!!errors.address}
              helperText={errors.address}
            />
            <TextField
              label="Lugar de nacimiento"
              name="birthplace"
              variant="outlined"
              value={formData.birthplace}
              onChange={handleChange}
              required
              fullWidth
              error={!!errors.birthplace}
              helperText={errors.birthplace}
            />
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
                <MenuItem value=""><em>Seleccionar</em></MenuItem>
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
