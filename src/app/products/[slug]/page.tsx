
import { notFound } from 'next/navigation';
import { getProducts, getProductById } from '@/lib/actions/products';
import { ProductDetailsClient } from './_components/ProductDetailsClient';
import type { Metadata } from 'next'

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

export default async function ProductPage({ params }: ProductPageProps) {
  const products = await getProducts();
  const product = products.find((p) => p.slug === params.slug);

  if (!product) {
    notFound();
  }
  
  const relatedProducts = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  return <ProductDetailsClient product={product} relatedProducts={relatedProducts} />;
}
