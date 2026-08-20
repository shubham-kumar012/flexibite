import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AppLayout from '../../components/AppLayout';
import { getAdminFoods, updateFoodStatus } from '../../services/foodService';
import {
  Search,
  Plus,
  Edit,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Apple,
} from 'lucide-react';

export default function AdminFoods() {
  const navigate = useNavigate();

  const [foods, setFoods] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalFoods, setTotalFoods] = useState(0);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchFoods = async (page = 1, searchQuery = '') => {
    setLoading(true);
    setError('');
    try {
      const data = await getAdminFoods({ page, limit: 15, search: searchQuery });
      setFoods(data.foods || []);
      setCurrentPage(data.currentPage || 1);
      setTotalPages(data.totalPages || 1);
      setTotalFoods(data.totalFoods || 0);
    } catch (err) {
      setError(err.message || 'Failed to load foods list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoods(currentPage, search);
  }, [currentPage]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchFoods(1, search);
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearch(val);
    if (val === '') {
      setCurrentPage(1);
      fetchFoods(1, '');
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const updatedStatus = !currentStatus;
      // Optimistic update
      setFoods((prev) =>
        prev.map((f) => (f._id === id ? { ...f, isActive: updatedStatus } : f))
      );
      await updateFoodStatus(id, updatedStatus);
    } catch (err) {
      alert(err.message || 'Failed to update status.');
      // Revert if error
      fetchFoods(currentPage, search);
    }
  };

  const getDietaryBadgeClass = (dietaryType) => {
    switch (dietaryType) {
      case 'vegan':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'vegetarian':
        return 'bg-green-50 text-green-800 border-green-200';
      case 'eggetarian':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'non_vegetarian':
        return 'bg-rose-50 text-rose-800 border-rose-200';
      default:
        return 'bg-charcoal-50 text-charcoal-700 border-charcoal-200';
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* HEADER SECTION */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Apple className="w-6 h-6 text-brand-600" />
              <h1 className="text-2xl font-display font-extrabold text-charcoal-900 tracking-tight">
                Food Database Management
              </h1>
            </div>
            <p className="text-xs text-charcoal-500 font-medium mt-0.5">
              Manage Indian food dataset items, nutrition values, serving sizes, and dietary classifications.
            </p>
          </div>

          <Link
            to="/admin/foods/new"
            className="px-4 py-2.5 rounded-xl bg-brand-600 text-white text-xs font-bold hover:bg-brand-700 transition-colors shadow-soft-sm flex items-center justify-center gap-2 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Food</span>
          </Link>
        </div>

        {/* SEARCH & FILTERS */}
        <div className="bg-white p-4 rounded-2xl border border-warmBg-border shadow-soft-sm flex flex-col sm:flex-row items-center justify-between gap-3">
          <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by food dish name..."
              value={search}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-warmBg-border text-xs font-medium text-charcoal-900 focus:outline-none focus:border-brand-500"
            />
          </form>

          <div className="text-xs font-bold text-charcoal-600 self-end sm:self-center">
            Total Foods: <span className="text-brand-700">{totalFoods}</span>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {/* FOODS TABLE */}
        <div className="bg-white rounded-2xl border border-warmBg-border shadow-soft-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-xs font-semibold text-charcoal-500 space-y-2">
              <div className="w-6 h-6 border-2 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p>Loading food items...</p>
            </div>
          ) : foods.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <p className="text-sm font-bold text-charcoal-800">No foods found</p>
              <p className="text-xs text-charcoal-500">
                {search ? `No matches found for "${search}"` : 'The food database is currently empty.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-warmBg border-b border-warmBg-border text-charcoal-500 font-bold uppercase tracking-wider">
                    <th className="py-3 px-4">Dish Name</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Dietary Type</th>
                    <th className="py-3 px-4">Calories (100g)</th>
                    <th className="py-3 px-4">Servings</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-warmBg-border">
                  {foods.map((food) => (
                    <tr key={food._id} className="hover:bg-warmBg/50 transition-colors">
                      <td className="py-3 px-4 font-bold text-charcoal-900">
                        {food.name}
                        <span className="block text-[10px] font-normal text-charcoal-400">
                          {food.slug}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-charcoal-700 font-medium">
                        {food.category}
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${getDietaryBadgeClass(
                            food.dietaryType
                          )}`}
                        >
                          {food.dietaryType?.replace('_', ' ')}
                        </span>
                      </td>

                      <td className="py-3 px-4 font-semibold text-charcoal-900">
                        {food.nutritionPer100g?.calories ?? 0} kcal
                      </td>

                      <td className="py-3 px-4 text-charcoal-600 font-medium">
                        {food.servings?.length > 0 ? (
                          <span className="px-2 py-0.5 rounded-md bg-warmBg border border-warmBg-border font-bold">
                            {food.servings.length} portion{food.servings.length > 1 ? 's' : ''}
                          </span>
                        ) : (
                          <span className="text-charcoal-400 text-[11px]">None defined</span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(food._id, food.isActive)}
                          className={`px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1 transition-colors border ${
                            food.isActive
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                              : 'bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100'
                          }`}
                        >
                          {food.isActive ? (
                            <>
                              <CheckCircle className="w-3 h-3 text-emerald-600" />
                              <span>Active</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3 h-3 text-rose-600" />
                              <span>Inactive</span>
                            </>
                          )}
                        </button>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => navigate(`/admin/foods/${food._id}/edit`)}
                          className="px-3 py-1 rounded-lg bg-warmBg text-charcoal-800 hover:bg-warmBg-muted font-bold border border-warmBg-border transition-colors inline-flex items-center gap-1"
                        >
                          <Edit className="w-3.5 h-3.5 text-brand-600" />
                          <span>Edit</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* PAGINATION FOOTER */}
          {totalPages > 1 && (
            <div className="p-4 bg-white border-t border-warmBg-border flex items-center justify-between text-xs font-semibold text-charcoal-600">
              <div>
                Page <span className="font-extrabold text-charcoal-900">{currentPage}</span> of{' '}
                <span className="font-extrabold text-charcoal-900">{totalPages}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  className="px-3 py-1.5 rounded-xl border border-warmBg-border hover:bg-warmBg disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <button
                  type="button"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  className="px-3 py-1.5 rounded-xl border border-warmBg-border hover:bg-warmBg disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
