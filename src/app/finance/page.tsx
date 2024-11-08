"use client";

import { useState, useEffect } from "react";
import { Typography, Button, IconButton, Alert } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import AddCardDialog from "@/components/finance/addCardDialog"; 
import CardList from "@/components/finance/cardList"; 

export const dynamic = "force-dynamic";

const CardManager = () => {
  const [cards, setCards] = useState<any[]>([]); 
  const [errorMessage, setErrorMessage] = useState("");
  const [success, setSuccess] = useState("");
  const [warning, setWarning] = useState("");

  useEffect(() => {
    setCards([
      { id: "1", title: "Visa Classic", description: "Tarjeta de crédito para compras online" },
      { id: "2", title: "Mastercard Gold", description: "Tarjeta de crédito con beneficios exclusivos" },
    ]);
  }, []);

  const [open, setOpen] = useState(false); 

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false); 
  };

  const handleAddCard = (newCard: { title: string; description: string }) => {
    setCards([...cards, { id: (cards.length + 1).toString(), ...newCard }]);
    setSuccess(`Tarjeta creada: ${newCard.title}`);
    setErrorMessage("");
    setWarning("");
    handleClose(); 
  };

  const handleDeleteCard = (cardId: string) => {
    const updatedCards = cards.filter((card) => card.id !== cardId);
    setCards(updatedCards);
    setWarning(`Tarjeta eliminada: ${cardId}`);
    setSuccess("");
    setErrorMessage("");
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <Typography variant="h4" component="h1" className="font-bold">
          Gestionar Tarjetas
        </Typography>
        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}
        {warning && <Alert severity="warning">{warning}</Alert>}

        <div className="hidden md:flex">
          <Button
            variant="contained"
            color="primary"
            onClick={handleClickOpen}
            className="flex items-center"
            startIcon={<AddIcon />}
          >
            Agregar Tarjeta
          </Button>
        </div>

        {/* Botón circular para agregar tarjeta - Pantallas pequeñas */}
        <div className="md:hidden">
          <IconButton
            color="primary"
            onClick={handleClickOpen}
            className="bg-blue-500 text-white hover:bg-blue-700 transition duration-300"
            aria-label="add"
            size="large"
          >
            <AddIcon />
          </IconButton>
        </div>
      </div>

      <CardList cards={cards} onDeleteCard={handleDeleteCard} />

      <AddCardDialog open={open} onClose={handleClose} onAddCard={handleAddCard} />
    </div>
  );
};

export default CardManager;
