
'use client'

import { useEffect, useState, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useDebounce } from '@/hooks/use-debounce';
import { searchProducts } from '@/lib/actions/products';
import type { Product } from '@/lib/types';
import { Search, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export function DynamicSearch() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);
  const [results, setResults] = useState<Product[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchResults = async () => {
      if (!debouncedQuery) {
        setResults([]);
        setIsLoading(false);
        setIsOpen(false);
        return;
      }
      setIsLoading(true);
      const fetchedResults = await searchProducts(debouncedQuery);
      setResults(fetchedResults);
      setIsLoading(false);
      setIsOpen(true);
    };

    fetchResults();
  }, [debouncedQuery]);

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
            placeholder="Search Product Here..."
            className="w-full pr-10 bg-white text-black rounded-full h-12"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              if(e.target.value) {
                setIsOpen(true);
              } else {
                setIsOpen(false);
              }
            }}
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground">
            {isLoading ? <Loader2 className="animate-spin" /> : <Search />}
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] mt-2" align="start">
        {results.length > 0 ? (
          <div className="space-y-4">
            {results.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className="flex items-center gap-4 hover:bg-accent p-2 rounded-md"
                onClick={handleLinkClick}
              >
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  width={40}
                  height={40}
                  className="rounded-md object-cover"
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
