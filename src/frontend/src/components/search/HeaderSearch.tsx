import { useState, useEffect, useRef } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useSearch } from '../../hooks/search/useSearch';
import { useDebouncedValue } from '../../hooks/useDebouncedValue';

export function HeaderSearch() {
  const [query, setQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const debouncedQuery = useDebouncedValue(query, 300);
  const { data: results = [] } = useSearch(debouncedQuery);
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleProductClick = (productId: string) => {
    setQuery('');
    setShowResults(false);
    navigate({ to: '/product/$productId', params: { productId } });
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search products..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowResults(true);
          }}
          onFocus={() => setShowResults(true)}
          className="pl-9 pr-9"
          aria-label="Search products"
        />
        {query && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
            onClick={() => {
              setQuery('');
              setShowResults(false);
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {showResults && query.trim() && (
        <Card className="absolute top-full mt-2 w-full max-h-96 overflow-y-auto z-50 shadow-medium">
          {results.length > 0 ? (
            <div className="p-2">
              {results.slice(0, 8).map((product) => (
                <button
                  key={product.id}
                  onClick={() => handleProductClick(product.id)}
                  className="w-full text-left p-3 hover:bg-accent rounded-md transition-colors"
                >
                  <div className="font-medium text-sm">{product.name}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    ${(Number(product.price) / 100).toFixed(2)}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-sm text-muted-foreground">
              No products found
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
