import React, { useEffect } from "react";
import Card from "./card";

interface CardListProps {
  cards: {  propietary: string; number: string; cvv: string; balance: number; type: string; expirationDate: string; erased?: boolean }[];
  onEditCard: (card: any) => void;
  onDeleteCard: (card: any) => void;
}

const CardList: React.FC<CardListProps> = ({ cards, onEditCard, onDeleteCard }) => {
  useEffect(() => {
  }, [cards]);

  return (
    <div className="space-y-4">
      {cards && cards.map((card) => (
        <Card key={card.number} cardData={card} onEditCard={() => onEditCard(card)} onDeleteCard={() => onDeleteCard(card)}/>
      ))}
    </div>
  );
};

export default CardList;