

import { notFound } from 'next/navigation';
import { getProducts, getProductById } from '@/lib/cached-data';
import { ProductDetailsClient } from './_components/ProductDetailsClient';
import type { Metadata } from 'next'
import type { Product } from '@/lib/types';

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
        const productData = allProducts.find((p) => p.slug === slug);
        
        if (!productData) {
          return { product: null, relatedProducts: [] };
        }
        
        const fullProduct = await getProductById(productData.id);

        const relatedProducts = allProducts
            .filter(p => p.category === productData.category && p.id !== productData.id)
            .slice(0, 4);
        
        return { product: fullProduct, relatedProducts };
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
