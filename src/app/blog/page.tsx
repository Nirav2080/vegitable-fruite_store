
import Link from "next/link";
import Image from "next/image";
import { getBlogPosts } from "@/lib/actions/blog";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

export default async function BlogPage() {
  const blogPosts = await getBlogPosts();
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold font-headline">Aotearoa Organics Blog</h1>
        <p className="mt-2 text-muted-foreground">Recipes, tips, and stories from our farm to your table.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogPosts.map((post) => (
          <Link href={`/blog/${post.slug}`} key={post.id} className="group">
            <Card className="overflow-hidden h-full flex flex-col hover:shadow-xl transition-shadow duration-300">
              <div className="relative h-56 w-full">
                <Image src={post.imageUrl} alt={post.title} fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
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
    </div>
  );
}
