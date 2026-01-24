

import { notFound } from 'next/navigation';
import { getProducts } from '@/lib/cached-data';
import { ProductDetailsClient } from './_components/ProductDetailsClient';
import type { Metadata } from 'next'

type ProductPageProps = {
  params: {
    slug: string;
  };
};

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { product } = await getProductAndRelated(params.slug);

  if (!product) {
    return {
      title: 'Product not found',
    }
  }
 
  return {
    title: `${product.name} | Aotearoa Organics`,
    description: product.description,
  }
}

async function getProductAndRelated(slug: string) {
    try {
        const allProducts = await getProducts();
        const product = allProducts.find((p) => p.slug === slug);
        
        if (!product) {
          return { product: null, relatedProducts: [] };
        }
        
        const relatedProducts = allProducts
            .filter(p => p.category === product.category && p.id !== product.id)
            .slice(0, 4);
        
        return { product, relatedProducts };
    } catch (error) {
        console.error(`Failed to fetch product data for slug ${slug}:`, error);
        return { product: null, relatedProducts: [] };
    }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { product, relatedProducts } = await getProductAndRelated(params.slug);

  if (!product) {
    notFound();
  }

  return <ProductDetailsClient product={product} relatedProducts={relatedProducts} />;
}

export async function generateStaticParams() {
  try {
    const products = await getProducts();
    return products.map((product) => ({
        slug: product.slug,
    }));
  } catch (error) {
    console.error('Failed to generate static params for products:', error);
    return [];
  }
}
