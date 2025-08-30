
'use server'

import type { Blog } from '@/lib/types';

const blogPosts: Blog[] = [
  {
    id: '1',
    slug: 'benefits-of-eating-seasonally',
    title: 'The Benefits of Eating Seasonally in New Zealand',
    excerpt: 'Discover why choosing seasonal produce is not only better for your health but also for the environment and local economy.',
    content: 'Eating seasonally means enjoying produce at its peak flavor and nutritional value. In New Zealand, this means juicy strawberries in summer and hearty root vegetables in winter. By aligning our diets with the seasons, we support local farmers, reduce food miles, and connect more deeply with the natural cycles of our beautiful country.',
    imageUrl: 'https://picsum.photos/seed/blog1/1200/800',
    author: 'Jane Doe',
    date: 'October 26, 2023',
  },
  {
    id: '2',
    slug: 'our-favourite-kiwi-summer-salad',
    title: 'Our Favourite Kiwi Summer Salad Recipe',
    excerpt: 'A refreshing and simple salad recipe perfect for a summer BBQ, featuring the best of New Zealand\'s summer produce.',
    content: 'This recipe combines sweet corn, ripe avocados, cherry tomatoes, and a zesty lime dressing. It\'s the perfect accompaniment to grilled meats or fish. The key is using the freshest ingredients, which you can find right here at Aotearoa Organics. It\'s a taste of a Kiwi summer in every bite!',
    imageUrl: 'https://picsum.photos/seed/blog2/1200/800',
    author: 'John Smith',
    date: 'November 15, 2023',
  },
  {
    id: '3',
    slug: 'guide-to-organic-farming',
    title: 'A Beginner\'s Guide to Organic Farming',
    excerpt: 'Ever wondered what "organic" really means? We break down the principles of organic farming and why it matters.',
    content: 'Organic farming is a holistic approach to agriculture that focuses on soil health, biodiversity, and ecological balance. It avoids synthetic pesticides and fertilizers, promoting a sustainable system that works in harmony with nature. When you choose organic, you\'re supporting a healthier planet and a more resilient food system.',
    imageUrl: 'https://picsum.photos/seed/blog3/1200/800',
    author: 'Emily White',
    date: 'December 02, 2023',
  },
];

export async function getBlogPosts(): Promise<Blog[]> {
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 100));
    return JSON.parse(JSON.stringify(blogPosts));
}

export async function getBlogPostBySlug(slug: string): Promise<Blog | null> {
    await new Promise(resolve => setTimeout(resolve, 50));
    const post = blogPosts.find(p => p.slug === slug);
    if (!post) {
        return null;
    }
    return JSON.parse(JSON.stringify(post));
}
