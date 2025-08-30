import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getBlogPostBySlug } from '@/lib/actions/blog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

type BlogPageProps = {
  params: {
    slug: string;
  };
};

export default async function BlogPostPage({ params }: BlogPageProps) {
  const post = await getBlogPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="container mx-auto px-4 py-8 max-w-4xl">
      <header className="mb-8">
        <div className="relative h-80 w-full rounded-lg overflow-hidden mb-8">
          <Image src={post.imageUrl} alt={post.title} fill className="object-cover" />
        </div>
        <h1 className="text-4xl font-bold font-headline text-center">{post.title}</h1>
        <div className="flex justify-center items-center gap-4 mt-4 text-muted-foreground">
           <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={`https://i.pravatar.cc/40?u=${post.author}`} />
              <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
            </Avatar>
            <span>{post.author}</span>
          </div>
          <span>&middot;</span>
          <time dateTime={post.date}>{post.date}</time>
        </div>
      </header>
      
      <div className="prose prose-lg max-w-none mx-auto text-foreground prose-headings:text-foreground prose-a:text-primary hover:prose-a:text-primary/80">
        <p className="lead text-xl text-muted-foreground mb-8">{post.excerpt}</p>
        <p>{post.content}</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi. Proin porttitor, orci nec nonummy molestie, enim est eleifend mi, non fermentum diam nisl sit amet erat. Duis semper. Duis arcu massa, scelerisque vitae, consequat in, pretium a, enim. Pellentesque congue. Ut in risus volutpat libero pharetra tempor. Cras vestibulum bibendum augue. Praesent egestas leo in pede. Praesent blandit odio eu enim. Pellentesque sed dui ut augue blandit sodales. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Aliquam nibh.</p>
        <p>Maecenas commodo, magna quis egestas consequat, justo orci scelerisque justo, nec semper libero turpis eget elit. Nunc ut egestas nibh. Proin et tellus quis lacus varius ullamcorper. Nam id quam ut turpis dictum tincidunt. Duis sit amet ipsum eu ante cursus scelerisque. Vivamus in sem. Nulla ut metus. Duis pretium, magna non tincidunt pharetra, dui sapien imperdiet mi, vel imperdiet eros lacus sit amet leo. Phasellus ac dolor. Etiam pellentesque, magna quis feugiat pulvinar, est sem lacinia velit, sed interdum lorem leo non purus. Vivamus aliquet, enim nec tempus egestas, ipsum enim lobortis lorem, quis consequat nunc nulla vitae lectus.</p>
      </div>
    </article>
  );
}
