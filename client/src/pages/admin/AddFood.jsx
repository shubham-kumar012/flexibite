import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../../components/AppLayout';
import FoodForm from '../../components/admin/FoodForm';
import { createAdminFood } from '../../services/foodService';

export default function AddFood() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (foodData) => {
    setIsSubmitting(true);
    try {
      await createAdminFood(foodData);
      navigate('/admin/foods');
    } catch (err) {
      alert(err.message || 'Failed to create food item.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppLayout>
      <FoodForm
        title="Add New Food Item"
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </AppLayout>
  );
}
