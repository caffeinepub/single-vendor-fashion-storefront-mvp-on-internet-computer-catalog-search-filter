import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ZoomIn } from 'lucide-react';
import type { Product } from '../../backend';

interface ProductGalleryProps {
  product: Product;
}

export function ProductGallery({ product }: ProductGalleryProps) {
  const [zoomOpen, setZoomOpen] = useState(false);
  const imageUrl = product.imageId || '/assets/generated/product-placeholder-set-1.dim_1200x1200.png';

  return (
    <>
      <div className="space-y-4">
        <div className="relative aspect-square overflow-hidden rounded-lg bg-muted group cursor-zoom-in" onClick={() => setZoomOpen(true)}>
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
            <ZoomIn className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
      </div>

      <Dialog open={zoomOpen} onOpenChange={setZoomOpen}>
        <DialogContent className="max-w-4xl">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-auto"
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
