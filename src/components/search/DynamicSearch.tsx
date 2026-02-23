
'use client'

import { useEffect, useState, useRef, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useDebounce } from '@/hooks/use-debounce';
import { searchProducts } from '@/lib/actions/products';
import type { ProductSearchResult } from '@/lib/types';
import { Search, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export function DynamicSearch() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);
  const [results, setResults] = useState<ProductSearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const fetchResults = useCallback(async () => {
    if (!debouncedQuery) {
      setResults([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
        const fetchedResults = await searchProducts(debouncedQuery);
        setResults(fetchedResults);
    } catch(error) {
        console.error("Failed to search products: ", error)
    }
    setIsLoading(false);
    if (!isOpen) setIsOpen(true);
  }, [debouncedQuery, isOpen]);


  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  const handleLinkClick = () => {
    setQuery('');
    setIsOpen(false);
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div className="w-full relative">
          <Input
            ref={inputRef}
            type="search"
            placeholder="Search products..."
            className=" pr-10 bg-secondary text-foreground rounded-xl h-10 border-none focus-visible:ring-2 focus-visible:ring-primary"
            value={query}
            onChange={(e) => {
              const newQuery = e.target.value;
              setQuery(newQuery);
              if (newQuery && !isOpen) {
                setIsOpen(true);
              } else if (!newQuery && isOpen) {
                setIsOpen(false);
              }
            }}
             onFocus={() => {
                if (query) {
                    setIsOpen(true);
                }
            }}
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground">
            {isLoading ? <Loader2 className="animate-spin" /> : <Search />}
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent 
        className="w-[var(--radix-popover-trigger-width)] mt-2 rounded-2xl border-border/30 shadow-md shadow-black/[0.04]" 
        align="start"
        onOpenAutoFocus={(e) => e.preventDefault()}
        >
        {results.length > 0 ? (
          <div className="space-y-1">
            {results.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className="flex items-center gap-4 hover:bg-primary/5 p-2.5 rounded-xl transition-colors duration-200"
                onClick={handleLinkClick}
              >
                <Image
                  src={Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : 'https://placehold.co/40x40/EEE/31343C'}
                  alt={product.name}
                  width={40}
                  height={40}
                  className="rounded-lg object-cover"
                />
                <div className="flex-1">
                  <p className="font-semibold text-sm">{product.name}</p>
                  <p className="text-sm text-primary font-bold">${product.price.toFixed(2)}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center text-sm text-muted-foreground py-4">
            {debouncedQuery && !isLoading ? "No products found." : "Start typing to search for products."}
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
