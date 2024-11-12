import { Typography, IconButton, Menu, MenuItem } from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";

interface CardProps {
  cardData: {
    id: string;
    dni: string;
    cardNumber: string;
    cvv: string;
    balance: number;
    type: string;
    expirationDate: string;
  };
  onEditCard: () => void;
}

const Card: React.FC<CardProps> = ({ cardData, onEditCard }) => {
  const { cardNumber, type } = cardData;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => setAnchorEl(null);

  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow-md relative text-gray-800 w-full md:w-72 h-40">
      <div className="absolute right-2 bottom-9 w-12 h-12 bg-blue-800 rounded-full opacity-50"></div>
      <div className="absolute right-8 bottom-9 w-12 h-12 bg-blue-600 rounded-full opacity-50"></div>

      <div className="absolute left-4 bottom-10 w-8 h-5 bg-yellow-400 rounded-sm"></div>

      <Typography variant="body2" className="font-semibold mt-4">
        Tarjeta {type === "debit" ? "Débito" : "Crédito"}
      </Typography>
      <Typography variant="h6" className="my-2">
        **** **** **** {cardNumber.slice(-4)}
      </Typography>

      <IconButton className="absolute bottom-2 right-2" onClick={handleMenuClick}>
        <MoreHorizIcon />
      </IconButton>
      <Menu anchorEl={anchorEl} open={openMenu} onClose={handleCloseMenu}>
        <MenuItem onClick={() => { handleCloseMenu(); onEditCard(); }}>
          <EditIcon className="mr-2" />
          Editar
        </MenuItem>
        <MenuItem onClick={() => handleCloseMenu()}>
          <DeleteIcon className="mr-2" />
          Eliminar
        </MenuItem>
      </Menu>
    </div>
  );
};

export default Card;
