import {
  Button,
  Stack,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from "@mui/material";
import { useState, useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { checkUserAvailability, handleRegister } from "@/services/auth";
import {
  fetchToken,
  fetchCountries,
  fetchStates,
  fetchCities,
} from "@/services/location";
import Stepper from "@/components/stepper";
import { updateUser } from "@/services/profile";
import UploadFiles from "../uploadFiles/uploadFiles";
import { MdEdit } from "react-icons/md";
import { RegisterData } from "@/schemas/users";
import { ICountry, IState, ICity } from "@/schemas/ilocation";

interface MultiStepFormProps {
  steps: string[];
  user?: RegisterData | null;
}

const MultiStepForm = ({ steps, user }: MultiStepFormProps) => {
  const router = useRouter();
  const [step, setStep] = useState(0);

  const step0Schema = z.object({
    user_image: z.string().optional(),
    username: z
      .string()
      .min(5, "El nombre de usuario debe tener al menos 5 caracteres")
      .max(20, "El nombre de usuario debe tener como máximo 20 caracteres")
      .regex(
        /^\S*$/,
        "El nombre de usuario no debe contener espacios en blanco"
      ),
    email: z
      .string()
      .email("El formato del email es incorrecto")
      .max(40, "El email debe tener como máximo 20 caracteres"),
    password: user
      ? z.string().optional()
      : z
          .string()
          .min(8, "La contraseña debe tener al menos 8 caracteres")
          .max(20, "La contraseña debe tener como máximo 20 caracteres")
          .regex(/^\S*$/, "La contraseña no debe contener espacios en blanco"),
    confirmPassword: user
      ? z.string().optional()
      : z
          .string()
          .refine(
            (val) => val === getValues().password,
            "Las contraseñas no coinciden"
          ),
  });

  const step1Schema = z.object({
    name1: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
    name2: z
      .string()
      .regex(/^\S*$/, "El nombre no debe contener espacios en blanco")
      .optional(),
    surname1: z
      .string()
      .min(3, "El apellido debe tener al menos 3 caracteres")
      .regex(/^\S*$/, "El apellido no debe contener espacios en blanco")
      .optional(),
    surname2: z
      .string()
      .regex(/^\S*$/, "El apellido no debe contener espacios en blanco")
      .optional(),
    dni: z
      .string()
      .nonempty("Se requiere el DNI")
      .regex(/^\S*$/, "El DNI no debe contener espacios en blanco ni letras"),
    gender: z.string().optional(),
  });

  const step2Schema = z.object({
    address: z.object({
      country: z.string().nonempty("Se requiere un país"),
      state: z.string().nonempty("Se requiere un estado"),
      city: z.string().nonempty("Se requiere una ciudad"),
      street: z.string().nonempty("Se requiere una calle o carrera"),
      numberStreet: z.string().nonempty("Número de vía requerido"),
      number: z.string().nonempty("Número requerido"),
    }),
  });

  const step3Schema = z.object({
    birthDate: z.string().refine((val) => {
      const birthDate = new Date(val);
      const today = new Date();
      const eighteenYearsAgo = new Date(
        today.getFullYear() - 18,
        today.getMonth(),
        today.getDate()
      );
      const ninetyYearsAgo = new Date(
        today.getFullYear() - 90,
        today.getMonth(),
        today.getDate()
      );
      return (
        birthDate <= eighteenYearsAgo &&
        birthDate >= ninetyYearsAgo &&
        birthDate <= today
      );
    }, "Debes tener entre 18 y 90 años, y la fecha de nacimiento no puede estar en el futuro"),
  });

  const getSchema = (): z.ZodSchema => {
    switch (step) {
      case 0:
        return step0Schema;
        break;
      case 1:
        return step1Schema;
        break;
      case 2:
        return step2Schema;
        break;
      case 3:
        return step3Schema;
        break;
      default:
        return z.object({});
    }
  };

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    watch,
    trigger,
    formState: { errors },
  } = useForm({
    defaultValues: {
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
      user_image: "",
    },
    resolver: zodResolver(getSchema()),
  });

  const [token, setToken] = useState<string | null>(null);
  const [countries, setCountries] = useState<ICountry[]>([]);
  const [addressStates, setAddressStates] = useState<IState[]>([]);
  const [addressCities, setAddressCities] = useState<ICity[]>([]);
  const [birthplaceStates, setBirthplaceStates] = useState<IState[]>([]);
  const [birthplaceCities, setBirthplaceCities] = useState<ICity[]>([]);
  // const [user_image, setuser_image] = useState('');
  const [isEditingFoto, setIsEditingFoto] = useState(true);


  useEffect(() => {
    const fetchTokenData = async () => {
      const token = await fetchToken();
      setToken(token);
    };
    fetchTokenData();
  }, []);

  useEffect(() => {
    if (token) {
      const fetchCountriesData = async () => {
        const result = await fetchCountries(token);
        setCountries(result);
      };
      fetchCountriesData();
    }
  }, [token]);

  const handleLocationChange = async (
    name: string,
    value: string,
    isAddress: boolean
  ) => {
    const locationType = isAddress ? "address" : "birthplace";
    setValue(
      `${locationType}.${name}` as
        | "address.country"
        | "address.state"
        | "address.city"
        | "birthplace.country"
        | "birthplace.state"
        | "birthplace.city",
      value
    );

    if (name === "country") {
      const states = await fetchStates(value, token);
      if (isAddress) {
        setAddressStates(states);
      } else {
        setBirthplaceStates(states);
      }
      setValue(`${locationType}.state`, "");
      setValue(`${locationType}.city`, "");
    } else if (name === "state") {
      const cities = await fetchCities(value, token);
      if (isAddress) {
        setAddressCities(cities);
      } else {
        setBirthplaceCities(cities);
      }
      setValue(`${locationType}.city`, "");
    }
  };

  useEffect(() => {
    if (user) {
      setValue("username", user.username);
      setValue("email", user.email);
      setValue("name1", user.name1);
      setValue("name2", user.name2);
      setValue("surname1", user.surname1);
      setValue("surname2", user.surname2);
      setValue("dni", user.dni);
      if (user.birthDate) {
        const birthDate = new Date(user.birthDate).toISOString().split("T")[0];
        setValue("birthDate", birthDate);
      }
      setValue("gender", user.gender);
      if (user.user_image) setValue("user_image", user.user_image);

      if (user.address) {
        const address = user.address.split(", ");
        handleLocationChange("country", address[3], true).then(() => {
          handleLocationChange("state", address[2], true).then(() => {
            handleLocationChange("city", address[1], true).then(() => {
              setValue("address.street", address[0].split(" ")[0]);
              setValue("address.numberStreet", address[0].split(" ")[1]);
              setValue("address.number", address[0].split("#")[1]);
            });
          });
        });
      }

      if (user.birthPlace) {
        const birthPlace = user.birthPlace.split(", ");
        handleLocationChange("country", birthPlace[2], false).then(() => {
          handleLocationChange("state", birthPlace[1], false).then(() => {
            handleLocationChange("city", birthPlace[0], false);
          });
        });
      }
    }
  }, [user, setValue, token, handleLocationChange]);

  const nextStep = async () => {
    const validateStep = await trigger();
    if (validateStep) {
      if (!user) { // Only check availability if not in edit mode
        const useravailability = await checkUserAvailability({
          email: getValues().email,
          dni: getValues().dni,
          username: getValues().username,
        });
        if (!useravailability[1]) {
          alert(useravailability[0]);
          return;
        }
      } else {
        const useravailability = await checkUserAvailability({
          email: getValues().email,
          dni: getValues().dni,
          username: getValues().username,
        }, user);
        if (!useravailability[1]) {
          alert(useravailability[0]);
          return;
        }
      }
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 0) setStep(step - 1);
  };

  const onSubmit = async () => {
    if (await trigger()) {
      const data = getValues();
      const formDataToSend = {
        ...data,
        address: `${data.address.street} ${data.address.numberStreet} # ${data.address.number}, ${data.address.city}, ${data.address.state}, ${data.address.country}`,
        birthPlace: `${data.birthplace.city}, ${data.birthplace.state}, ${data.birthplace.country}`,
        birthDate: new Date(data.birthDate),
        user_image: data.user_image.toString(),
      };
      console.log("this is the user", formDataToSend);
      let res;
      if (user) {
        res = await updateUser(formDataToSend);
        console.log("Update user\n", res)
        if (!res.error ) {
          console.log(res);
          alert("Usuario actualizado exitosamente");
          router.push("/");
        } else {
          alert(`Error al actualizar el usuario:\n${res.message}`);
          console.log(res);
        }
      } else {
        res = await handleRegister(formDataToSend);
        if (res === "Usuario registrado") {
          alert("Usuario registrado exitosamente");
          router.push("/auth/login");
        } else {
          alert(`Error al registrar el usuario:\n${res.message}`);
        }
      }
    }
  };

  return (
    <>
      <Stepper steps={steps} currentStep={step + 1} />
      <form onSubmit={handleSubmit(onSubmit)} className="w-full">
        <Stack spacing={2} className="w-full max-w-md">
          {step === 0 && (
            <>
              <div className="flex flex-col items-center mb-5">
                <div className="relative w-24 h-24">
                    {getValues().user_image.length > 0 ? (
                    <Image
                      src={getValues().user_image}
                      alt="Foto de perfil"
                      className="w-full h-full rounded-full object-contain bg-gray-300 flex justify-center items-center"
                      width={96}
                      height={96}
                    />
                    ) : (
                    <div className="w-full h-full rounded-full flex items-center justify-center bg-gray-300 text-gray-500 text-center p-2">
                      No se ha seleccionado ninguna foto de perfil
                    </div>
                    )}
                  <button
                    type="button"
                    className="absolute top-1 right-1 bg-indigo-600 border-none rounded-full p-1 cursor-pointer shadow-md transition-colors duration-300 hover:bg-indigo-700"
                    onClick={() => setIsEditingFoto(!isEditingFoto)}
                  >
                    <MdEdit />
                  </button>
                </div>
                <div className="mt-2">
                  <label className="block text-center">
                    Foto de Perfil (opcional)
                  </label>
                </div>
                {isEditingFoto && (
                  <div className="mt-2">
                    <UploadFiles
                      onUpload={(url) => {
                        console.log(url);
                        setIsEditingFoto(false);
                        setValue("user_image", url);
                      }}
                    />
                  </div>
                )}
              </div>
              <Controller
                name="username"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    {...(user ? { disabled: true } : {})}
                    label="Nombre de usuario"
                    variant="outlined"
                    required
                    fullWidth
                    error={!!errors.username}
                    helperText={errors.username ? errors.username.message : ""}
                  />
                )}
              />
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    {...(user ? { disabled: true } : {})}
                    label="Email"
                    type="email"
                    variant="outlined"
                    required
                    fullWidth
                    error={!!errors.email}
                    helperText={errors.email ? errors.email.message : ""}
                  />
                )}
              />
              {!user && (
                <>
                  <Controller
                    name="password"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Contraseña"
                        type="password"
                        variant="outlined"
                        required
                        fullWidth
                        error={!!errors.password}
                        helperText={errors.password?.message}
                      />
                    )}
                  />

                  <Controller
                    name="confirmPassword"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Confirmar contraseña"
                        type="password"
                        variant="outlined"
                        required
                        fullWidth
                        error={!!errors.confirmPassword}
                        helperText={errors.confirmPassword?.message}
                      />
                    )}
                  />
                </>
              )}
            </>
          )}

          {step === 1 && (
            <>
              <Controller
                name="name1"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Primer nombre"
                    variant="outlined"
                    fullWidth
                    error={!!errors.name1}
                    helperText={errors.name1?.message}
                  />
                )}
              />
              <Controller
                name="name2"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Segundo nombre"
                    variant="outlined"
                    fullWidth
                    error={!!errors.name2}
                    helperText={errors.name2?.message}
                  />
                )}
              />
              <Controller
                name="surname1"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Primer apellido"
                    variant="outlined"
                    fullWidth
                    error={!!errors.surname1}
                    helperText={errors.surname1?.message}
                  />
                )}
              />
              <Controller
                name="surname2"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Segundo apellido"
                    variant="outlined"
                    fullWidth
                    error={!!errors.surname2}
                    helperText={errors.surname2?.message}
                  />
                )}
              />
              <Controller
                name="dni"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    {...(user && user.dni ? { disabled: true } : {})}
                    label="DNI"
                    type="number"
                    variant="outlined"
                    fullWidth
                    error={!!errors.dni}
                    helperText={errors.dni?.message}
                  />
                )}
              />
              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.gender}>
                    <InputLabel id="gender-label">Género</InputLabel>
                    <Select {...field} labelId="gender-label" label="Género">
                      <MenuItem value="">
                        <em>Seleccionar</em>
                      </MenuItem>
                      <MenuItem value="male">Masculino</MenuItem>
                      <MenuItem value="female">Femenino</MenuItem>
                      <MenuItem value="other">Otro</MenuItem>
                    </Select>
                    {errors.gender && <span>{errors.gender.message}</span>}
                  </FormControl>
                )}
              />
            </>
          )}

          {step === 2 && (
            <>
              <Controller
                name="address.country"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="País"
                    variant="outlined"
                    required
                    onChange={(e) =>
                      handleLocationChange("country", e.target.value, true)
                    }
                    error={!!errors.address?.country}
                    helperText={errors.address?.country?.message}
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
                )}
              />
              <Controller
                name="address.state"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Estado"
                    variant="outlined"
                    required
                    disabled={!watch("address.country")}
                    onChange={(e) =>
                      handleLocationChange("state", e.target.value, true)
                    }
                    error={!!errors.address?.state}
                    helperText={errors.address?.state?.message}
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
                      <MenuItem disabled>Cargando estados...</MenuItem>
                    )}
                  </TextField>
                )}
              />
              <Controller
                name="address.city"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Ciudad"
                    variant="outlined"
                    required
                    disabled={!watch("address.state")}
                    onChange={(e) =>
                      handleLocationChange("city", e.target.value, true)
                    }
                    error={!!errors.address?.city}
                    helperText={errors.address?.city?.message}
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
                )}
              />
              <Controller
                name="address.street"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Tipo de vía"
                    variant="outlined"
                    required
                    disabled={!watch("address.city")}
                    error={!!errors.address?.street}
                    helperText={errors.address?.street?.message}
                  >
                    <MenuItem value="Calle">Calle</MenuItem>
                    <MenuItem value="Carrera">Carrera</MenuItem>
                  </TextField>
                )}
              />
              <Stack direction="row" spacing={2} alignItems="center">
                <Controller
                  name="address.numberStreet"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Número vía"
                      type="number"
                      variant="outlined"
                      required
                      disabled={!watch("address.street")}
                      error={!!errors.address?.numberStreet}
                      helperText={errors.address?.numberStreet?.message}
                    />
                  )}
                />
                <Typography variant="subtitle1" component="h5" align="left">
                  #
                </Typography>
                <Controller
                  name="address.number"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Número"
                      type="number"
                      variant="outlined"
                      required
                      disabled={!watch("address.numberStreet")}
                      error={!!errors.address?.number}
                      helperText={errors.address?.number?.message}
                    />
                  )}
                />
              </Stack>
            </>
          )}

          {step === 3 && (
            <>
              <Controller
                name="birthplace.country"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="País"
                    variant="outlined"
                    onChange={(e) =>
                      handleLocationChange("country", e.target.value, false)
                    }
                    error={!!errors.birthplace?.country}
                    helperText={errors.birthplace?.country?.message}
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
                )}
              />
              <Controller
                name="birthplace.state"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Estado"
                    variant="outlined"
                    required
                    disabled={!watch("birthplace.country")}
                    onChange={(e) =>
                      handleLocationChange("state", e.target.value, false)
                    }
                    error={!!errors.birthplace?.state}
                    helperText={errors.birthplace?.state?.message}
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
                      <MenuItem disabled>Cargando estados...</MenuItem>
                    )}
                  </TextField>
                )}
              />
              <Controller
                name="birthplace.city"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Ciudad"
                    variant="outlined"
                    required
                    disabled={!watch("birthplace.state")}
                    onChange={(e) =>
                      handleLocationChange("city", e.target.value, false)
                    }
                    error={!!errors.birthplace?.city}
                    helperText={errors.birthplace?.city?.message}
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
                )}
              />
              <Controller
                name="birthDate"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Fecha de nacimiento"
                    type="date"
                    variant="outlined"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.birthDate}
                    helperText={errors.birthDate?.message}
                  />
                )}
              />
            </>
          )}

          <div>
            {step > 0 && <Button onClick={prevStep}>Atrás</Button>}
            {step < 3 ? (
              <Button onClick={nextStep}>Siguiente</Button>
            ) : (
              <Button onClick={onSubmit}>{user ? "Guardar" : "Enviar"}</Button>
            )}
          </div>
        </Stack>
      </form>
    </>
  );
};

export default MultiStepForm;
