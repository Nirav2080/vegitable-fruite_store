import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductCard } from "@/components/products/ProductCard";
import { blogPosts, products } from "@/lib/data";
import { ArrowRight, Leaf, Package, Carrot } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const categories = [
  { name: 'Fresh Fruits', href: '/products?category=Fruits', icon: <Leaf className="w-8 h-8 text-primary" />, description: 'The best seasonal fruits, locally sourced.' },
  { name: 'Crisp Vegetables', href: '/products?category=Vegetables', icon: <Carrot className="w-8 h-8 text-primary" />, description: 'A wide range of farm-fresh vegetables.' },
  { name: 'Organic Boxes', href: '/products?category=Organic+Boxes', icon: <Package className="w-8 h-8 text-primary" />, description: 'Curated boxes of mixed organic produce.' },
]

export default function Home() {
  const weeklySpecials = products.filter(p => p.isSeasonal).slice(0, 4);
  const featuredBlogs = blogPosts.slice(0, 3);

  return (
    <div className="flex flex-col gap-16 md:gap-24">
      <section className="relative h-[60vh] md:h-[80vh] w-full">
        <Image
          src="https://picsum.photos/1800/1200"
          alt="Fresh produce on a wooden table"
          data-ai-hint="fresh produce"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white p-4">
          <h1 className="text-4xl md:text-6xl font-headline font-bold drop-shadow-lg">
            Naturally Fresh, Locally Sourced
          </h1>
          <p className="mt-4 text-lg md:text-xl max-w-2xl drop-shadow-md">
            Experience the taste of Aotearoa with our premium selection of organic fruits and vegetables.
          </p>
          <Button asChild size="lg" className="mt-8 bg-primary hover:bg-primary/90 text-primary-foreground font-bold">
            <Link href="/products">Shop All Produce</Link>
          </Button>
        </div>
      </section>

      <section className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center font-headline">Shop by Category</h2>
        <p className="mt-2 text-center text-muted-foreground max-w-xl mx-auto">Explore our diverse range of fresh produce, carefully selected for quality and taste.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          {categories.map((category) => (
            <Link href={category.href} key={category.name} className="group">
              <Card className="h-full flex flex-col text-center items-center hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <div className="mx-auto bg-primary/10 p-4 rounded-full">
                    {category.icon}
                  </div>
                  <CardTitle className="font-headline mt-4">{category.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{category.description}</p>
                </CardContent>
                <CardFooter className="mt-auto justify-center">
                  <span className="font-semibold text-primary group-hover:underline">
                    Shop Now
                  </span>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      </section>
      
      <section className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center font-headline">Weekly Specials</h2>
        <p className="mt-2 text-center text-muted-foreground max-w-xl mx-auto">Check out this week's seasonal picks, offering the best value and freshness.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-8">
          {weeklySpecials.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className="text-center mt-8">
          <Button asChild variant="outline">
            <Link href="/products">View All Products <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </section>

      <section className="bg-muted py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center font-headline">From Our Blog</h2>
          <p className="mt-2 text-center text-muted-foreground max-w-xl mx-auto">Get inspired with our latest recipes, tips, and stories from the farm.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            {featuredBlogs.map((post) => (
              <Link href={`/blog/${post.slug}`} key={post.id} className="group">
                <Card className="overflow-hidden h-full flex flex-col hover:shadow-xl transition-shadow duration-300">
                  <div className="relative h-48 w-full">
                    <Image src={post.imageUrl} alt={post.title} fill className="object-cover"/>
                  </div>
                  <CardHeader>
                    <CardTitle className="font-headline text-xl group-hover:text-primary transition-colors">{post.title}</CardTitle>
                    <p className="text-sm text-muted-foreground pt-2">{post.date} &middot; {post.author}</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{post.excerpt}</p>
                  </CardContent>
                  <CardFooter className="mt-auto">
                    <span className="font-semibold text-primary group-hover:underline">Read More <ArrowRight className="inline-block ml-1 h-4 w-4" /></span>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Button asChild>
              <Link href="/blog">Visit Blog</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
