import React from "react";
import Card from "./card";

interface CardListProps {
  cards: { id: string; dni: string; cardNumber: string; cvv: string; balance: number; type: string; expirationDate: string }[];
  onEditCard: (card: any) => void;
}

const CardList: React.FC<CardListProps> = ({ cards, onEditCard }) => {
  return (
    <div className="space-y-4">
      {cards.map((card) => (
        <Card key={card.id} cardData={card} onEditCard={() => onEditCard(card)} />
      ))}
    </div>
  );
};

export default CardList;