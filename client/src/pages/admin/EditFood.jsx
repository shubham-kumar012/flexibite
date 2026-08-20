import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AppLayout from '../../components/AppLayout';
import FoodForm from '../../components/admin/FoodForm';
import { getAdminFoodById, updateAdminFood } from '../../services/foodService';
import { AlertCircle } from 'lucide-react';

export default function EditFood() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [food, setFood] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchFoodDetails = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await getAdminFoodById(id);
        setFood(data.food);
      } catch (err) {
        setError(err.message || 'Failed to fetch food details.');
      } finally {
        setLoading(false);
      }
    };

    fetchFoodDetails();
  }, [id]);

  const handleSubmit = async (foodData) => {
    setIsSubmitting(true);
    try {
      await updateAdminFood(id, foodData);
      navigate('/admin/foods');
    } catch (err) {
      alert(err.message || 'Failed to update food item.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppLayout>
      {loading ? (
        <div className="p-12 text-center text-xs font-semibold text-charcoal-500 space-y-2">
          <div className="w-6 h-6 border-2 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p>Loading food details...</p>
        </div>
      ) : error ? (
        <div className="p-6 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      ) : (
        <FoodForm
          title={`Edit Food: ${food?.name || ''}`}
          initialValues={food}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      )}
    </AppLayout>
  );
}
