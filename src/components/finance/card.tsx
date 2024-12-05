import { Typography, IconButton, Menu, MenuItem } from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";

interface CardProps {
  cardData: {
    propietary: string;
    number: string;
    cvv: string;
    balance: number;
    type: string;
    expirationDate: string;
    erased?: boolean;
  };
  onEditCard: () => void;
  onDeleteCard: () => void;
}

const Card: React.FC<CardProps> = ({ cardData, onEditCard, onDeleteCard }) => {
  const { number, type, erased } = cardData;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => setAnchorEl(null);

  if (erased) {
    return null;
  }

  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow-md relative text-gray-800 w-full md:w-72 h-40">
      <div className="absolute right-2 bottom-9 w-8 h-8 md:w-12 md:h-12 bg-blue-800 rounded-full opacity-50"></div>
      <div className="absolute right-8 bottom-9 w-8 h-8 md:w-12 md:h-12 bg-blue-600 rounded-full opacity-50"></div>

      <div className="absolute left-4 bottom-10 w-6 h-4 md:w-8 md:h-5 bg-yellow-400 rounded-sm"></div>

      <Typography variant="body2" className="font-semibold mt-4">
        Tarjeta {type === "debit" ? "Débito" : "Crédito"}
      </Typography>
      <Typography variant="h6" className="my-2">
        **** **** **** {number ? number.slice(-4) : "****"}
      </Typography>

      <IconButton className="absolute bottom-2 right-2" onClick={handleMenuClick}>
        <MoreHorizIcon />
      </IconButton>
      <Menu anchorEl={anchorEl} open={openMenu} onClose={handleCloseMenu}>
        <MenuItem onClick={() => { handleCloseMenu(); onEditCard(); }}>
          <EditIcon className="mr-2" />
          Editar
        </MenuItem>
        <MenuItem onClick={() => {handleCloseMenu(); onDeleteCard();} }>
          <DeleteIcon className="mr-2" />
          Eliminar
        </MenuItem>
      </Menu>
    </div>
  );
};

export default Card;
