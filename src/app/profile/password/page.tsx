"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { changePassword } from "@/services/profile";
import { TextField, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useRouter } from "next/navigation";

const UpdatePasswordForm = () => {
  const theme = useTheme();
  const router = useRouter();

  const schema: z.ZodSchema = z.object({
    currentPassword: z
      .string()
      .nonempty("Se requiere la contraseña actual")
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .max(20, "La contraseña debe tener como máximo 20 caracteres")
      .regex(/^\S*$/, "La contraseña no debe contener espacios en blanco"),
    newPassword: z
      .string()
      .nonempty("Se requiere la nueva contraseña")
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .max(20, "La contraseña debe tener como máximo 20 caracteres")
      .regex(/^\S*$/, "La contraseña no debe contener espacios en blanco")
      .refine((data) => data !== watch("currentPassword"), {
        message: "La nueva contraseña debe ser diferente a la actual",
      }),
    confirmPassword: z
      .string()
      .nonempty("Por favor confirma tu nueva contraseña")
      .refine((data) => data === watch("newPassword"), {
        message: "Las contraseñas no coinciden",
      }),
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    resolver: zodResolver(schema),
  });

  // useEffect(() => {
  //   const mainElement = document.querySelector("main");
  //   if (mainElement) {
  //     mainElement.style.display = "flex";
  //     mainElement.style.alignItems = "center";
  //   }
  // }, []);

  const onSubmit = handleSubmit(async (data) => {
    const token = localStorage.getItem("token");
    let username;
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      username = payload.username;
    }

    const dataToSend = {
      username,
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    };
    const res = await changePassword(dataToSend);
    if (res === true) {
      console.log(res);
      alert("Cambio de contraseña realizado");
      router.push("/");
      router.refresh();
    } else {
      console.log(res);
      alert(`Error al intentar cambiar contraseña:\n${res.message}`);
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <Typography variant="h4" component="h1" align="center">
        Cambiar contraseña
      </Typography>
      {}
      <div className="space-y-2 w-3/4 mx-auto">
        <TextField
          id="currentPassword"
          type="password"
          label="Contraseña actual"
          {...register("currentPassword")}
          error={!!errors.currentPassword}
          helperText={errors.currentPassword?.message}
        />
      </div>
      <div className="space-y-2 w-3/4 mx-auto">
        <TextField
          id="newPassword"
          type="password"
          label="Nueva contraseña"
          {...register("newPassword")}
          error={!!errors.newPassword}
          helperText={errors.newPassword?.message}
        />
      </div>
      <div className="space-y-2 w-3/4 mx-auto">
        <TextField
          id="confirmPassword"
          type="password"
          label="Confirmar nueva contraseña"
          {...register("confirmPassword")}
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword?.message}
        />
      </div>

      <button
        type="submit"
        className="mt-4 px-4 py-2 text-white rounded"
        style={{ backgroundColor: theme.palette.primary.main }}
      >
        Actualizar contraseña
      </button>
    </form>
  );
};

export default UpdatePasswordForm;
