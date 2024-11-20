import React, { useContext, useEffect } from 'react';
import { CartContext } from '@/context/cart';


function ConfirmPage() {
  const { cart } = useContext(CartContext);

  useEffect(() => {
    const sendCartToService = async () => {
      try {
        await createBook(cart);
        console.log('Book created successfully');
      } catch (error) {
        console.error('Error creating book:', error);
      }
    };

    sendCartToService();
  }, [cart]);

  return (
    <div>
      <h1>Confirm Booking</h1>
      {/* Add more UI elements as needed */}
    </div>
  );
};

export default ConfirmPage;