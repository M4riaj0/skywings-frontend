import React from "react";
import Card from "./card"

interface CardListProps {
  cards: { id: string; title: string; description: string }[];
  onDeleteCard: (id: string) => void;
}

const CardList: React.FC<CardListProps> = ({ cards, onDeleteCard }) => {
  return (
    <div className="space-y-4">
      {cards.map((card) => (
        <Card
          key={card.id}
          title={card.title}
          description={card.description}
          cardId={card.id}
          onDelete={onDeleteCard}
        />
      ))}
    </div>
  );
};

export default CardList;
