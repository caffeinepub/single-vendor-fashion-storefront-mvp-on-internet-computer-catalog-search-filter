import { useRecommendations } from '../../hooks/recommendations/useRecommendations';
import { ProductCard } from '../catalog/ProductCard';

export function RecommendationsRow() {
  const { data: recommendations = [] } = useRecommendations();

  if (recommendations.length === 0) return null;

  return (
    <section>
      <h2 className="text-2xl font-light mb-6">You might also like</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {recommendations.slice(0, 4).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
