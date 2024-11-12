"use client";

import { useState } from "react";
import { AppBar, Toolbar, Button, Drawer, Typography, Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CardList from "@/components/finance/cardList";
import AddCardDialog from "@/components/finance/addCardDialog";

interface CardType {
  id: string;
  dni: string;
  cardNumber: string;
  cvv: string;
  balance: number;
  type: "debit" | "credit";
  expirationDate: string;
}

const CardManager = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<CardType | null>(null);

  const cards: CardType[] = [
    { id: "1", dni: "1234567890", cardNumber: "1234567890123456", cvv: "123", balance: 5000, type: "debit", expirationDate: "12/25" },
    { id: "2", dni: "0987654321", cardNumber: "9876543210987654", cvv: "321", balance: 7000, type: "credit", expirationDate: "11/24" },
  ];

  const toggleDrawer = () => setDrawerOpen(!drawerOpen);

  const handleAddCardOpen = () => {
    setSelectedCard(null); 
    setDialogOpen(true);
  };

  const handleEditCard = (card: CardType) => {
    setSelectedCard(card); 
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedCard(null); 
  };

  return (
    <>
      <AppBar position="static" color="default">
        <Toolbar>
          <Button color="primary" onClick={toggleDrawer}>
            Gestionar Tarjetas
          </Button>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={toggleDrawer}
        className="md:w-1/2 w-full"
      >
        <Box p={4}>
          <Typography variant="h5">Gestionar Tarjetas</Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddCardOpen}
            startIcon={<AddIcon />}
            className="mt-4"
          >
            Agregar Tarjeta
          </Button>
          <Box mt={4}> 
            <CardList cards={cards} onEditCard={handleEditCard} />
          </Box>
        </Box>
      </Drawer>

      <AddCardDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        initialData={selectedCard || undefined} 
      />
    </>
  );
};

export default CardManager;
