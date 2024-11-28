import React, { useEffect } from "react";
import Card from "./card";
import { ICard } from "@/schemas/cards";

interface CardListProps {
  cards: ICard[];
  onEditCard: (card: ICard) => void;
  onDeleteCard: (card: ICard) => void;
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