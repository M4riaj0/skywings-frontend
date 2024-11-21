"use client";

import { useEffect, useState } from "react";
import { Button, Drawer, Typography, Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CardList from "./cardList";
import AddCardDialog from "./addCardDialog";
import { getCards, addCard, updateCard, deleteCard } from "@/services/cards";

interface CardType {
  propietary: string;
  number: string;
  cvv: string;
  balance: number;
  type: "debit" | "credit";
  expirationDate: string;
  erased?: boolean;
}

interface CardManagerProps {
  drawerOpen: boolean;
  toggleDrawer: () => void;
}

const CardManager: React.FC<CardManagerProps> = ({ drawerOpen, toggleDrawer }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<CardType | null>(null);
  const [cards, setCards] = useState<CardType[]>([]);
  const [editingCard, setEditingCard] = useState(false);

  const fetchCards = async () => {
    try {
      const cardsList = await getCards();
      setCards(cardsList);
    } catch (error) {
      setErrorMessage("Error al obtener la lista de administradores");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  const handleAddCardOpen = () => {
    setSelectedCard(null);
    setEditingCard(false);
    setDialogOpen(true);
  };

  const handleEditCard = (card: CardType) => {
    setSelectedCard(card);
    setEditingCard(true);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setSelectedCard(null);
    setEditingCard(false);
    setDialogOpen(false);
  };

  const handleDialogSubmit = async (data: CardType) => {
    if (editingCard) {
      const { number, balance } = data;
      await updateCard({ number, balance });
    } else {
      await addCard(data);
    }
    setDialogOpen(false);
    fetchCards();
  };

  return (
    <>
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
            <CardList
              cards={cards}
              onEditCard={handleEditCard}
              onDeleteCard={async (card: CardType) => {
                try {
                  await deleteCard(card.number);
                  fetchCards();
                } catch (error) {
                  setErrorMessage("Error al eliminar la tarjeta");
                  console.error(error);
                }
              }}
            />
          </Box>
        </Box>
      </Drawer>

      <AddCardDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        initialData={selectedCard || undefined}
        editing={editingCard}
        onSubmit={handleDialogSubmit}
      />
    </>
  );
};

export default CardManager;

function setErrorMessage(arg0: string) {
  throw new Error(arg0);
}
