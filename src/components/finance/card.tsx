import React from "react";
import { IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

interface CardProps {
  title: string;
  description: string;
  cardId: string;
  onDelete: (id: string) => void;
}

const Card: React.FC<CardProps> = ({ title, description, cardId, onDelete }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);

  const handleClickMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center space-x-4">
      <div className="flex-1">
        <h3 className="font-semibold text-lg">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>

      <div className="relative">
        <IconButton onClick={handleClickMenu}>
          <MoreVertIcon />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={openMenu}
          onClose={handleCloseMenu}
          PaperProps={{
            style: {
              maxHeight: 220,
              width: '20ch',
            },
          }}
        >
          <MenuItem onClick={() => { handleCloseMenu(); }}>Editar</MenuItem>
          <MenuItem onClick={() => { onDelete(cardId); handleCloseMenu(); }}>Eliminar</MenuItem>
        </Menu>
      </div>
    </div>
  );
};

export default Card;
