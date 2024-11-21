import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import Image from "next/image";

interface ResetPasswordProps {
  open: boolean;
  onClose: () => void;
}

export default function ResetPassword({ open, onClose }: ResetPasswordProps) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Recuperar contraseña</DialogTitle>
      <DialogContent>
        <div className="mt-20 flex flex-col justify-center items-center">
            <h1 className="text-4xl font-bold">Bienvenido</h1>
            <Image src="/images/logo.png" alt="Logo" width={200} height={200}/>
            <h3>Más funcionalidades estarán disponibles próximamente</h3>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancelar
        </Button>
        {/* <Button onClick={handleSubmit} color="primary">
          Recuperar contraseña
        </Button> */}
      </DialogActions>
    </Dialog>
  );
}
