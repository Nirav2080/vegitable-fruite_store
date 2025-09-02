

import { notFound } from 'next/navigation';
import { getProducts, getProductById } from '@/lib/actions/products';
import { ProductDetailsClient } from './_components/ProductDetailsClient';
import type { Metadata } from 'next'
import type { Product } from '@/lib/types';

type ProductPageProps = {
  params: {
    slug: string;
  };
};

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const products = await getProducts();
  const product = products.find((p) => p.slug === params.slug);

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
    const allProducts = await getProducts();
    const product = allProducts.find((p) => p.slug === slug);
    
    if (!product) {
      return { product: null, relatedProducts: [] };
    }
    
    const fullProduct = await getProductById(product.id);

    const relatedProducts = allProducts
        .filter(p => p.category === product.category && p.id !== product.id)
        .slice(0, 4);
    
    return { product: fullProduct, relatedProducts };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { product, relatedProducts } = await getProductAndRelated(params.slug);

  if (!product) {
    notFound();
  }

  return <ProductDetailsClient product={product} relatedProducts={relatedProducts} />;
}

export async function generateStaticParams() {
    const products = await getProducts();
    return products.map((product) => ({
        slug: product.slug,
    }));
}
