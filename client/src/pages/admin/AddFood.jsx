import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../../components/AppLayout';
import FoodForm from '../../components/admin/FoodForm';
import { createAdminFood, uploadAdminFoodImage } from '../../services/foodService';

export default function AddFood() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (foodData, imageFile) => {
    setIsSubmitting(true);
    try {
      const res = await createAdminFood(foodData);
      if (imageFile && res.food?._id) {
        await uploadAdminFoodImage(res.food._id, imageFile);
      }
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
