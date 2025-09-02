
'use client';

import { useState } from 'react';
import type { Product, Review } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export const mockReviews: Review[] = [
  {
    id: '1',
    author: 'Jane Doe',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
    rating: 5,
    title: 'Absolutely Fresh!',
    comment: 'These are the best apples I have ever tasted. So crisp and juicy. Will definitely buy again!',
    date: '2023-05-20',
  },
  {
    id: '2',
    author: 'John Smith',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026705d',
    rating: 4,
    title: 'Great quality',
    comment: 'Very good quality, but a bit pricey. Still, you get what you pay for. Recommended.',
    date: '2023-05-18',
  },
   {
    id: '3',
    author: 'Peter Jones',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026706d',
    rating: 5,
    title: 'Perfect for my organic box',
    comment: 'I love that these are organic. They taste amazing and are perfect for my family\'s health.',
    date: '2023-05-15',
  },
];


interface ProductReviewsProps {
  product: Product;
  reviews: Review[];
}

export function ProductReviews({ product, reviews: initialReviews }: ProductReviewsProps) {
  const { toast } = useToast();
  const [reviews, setReviews] = useState(initialReviews);
  const [newReview, setNewReview] = useState({ rating: 0, title: '', comment: '' });
  const [hoverRating, setHoverRating] = useState(0);

  const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;
  const ratingDistribution = [5, 4, 3, 2, 1].map(star => {
    const count = reviews.filter(r => r.rating === star).length;
    return { star, count, percentage: (count / reviews.length) * 100 };
  });

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(newReview.rating === 0 || !newReview.title || !newReview.comment) {
        toast({
            title: "Incomplete review",
            description: "Please provide a rating, title, and comment.",
            variant: "destructive"
        })
        return;
    }
    const submittedReview: Review = {
        id: (reviews.length + 1).toString(),
        author: 'New User', // Replace with actual user data
        avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026707d',
        rating: newReview.rating,
        title: newReview.title,
        comment: newReview.comment,
        date: new Date().toISOString().split('T')[0],
    };
    setReviews([submittedReview, ...reviews]);
    setNewReview({ rating: 0, title: '', comment: '' });
     toast({
        title: "Review submitted",
        description: "Thank you for your feedback!",
    })
  }

  return (
    <div className="grid md:grid-cols-5 gap-8">
      <div className="md:col-span-2">
        <h3 className="text-2xl font-bold font-headline mb-4">Customer Reviews</h3>
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`h-5 w-5 ${i < Math.round(averageRating) ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} />
            ))}
          </div>
          <span className="font-semibold">{averageRating.toFixed(1)} out of 5</span>
        </div>
        <p className="text-sm text-muted-foreground mb-4">Based on {reviews.length} reviews</p>

        <div className="space-y-2">
            {ratingDistribution.map(({star, count, percentage}) => (
                <div key={star} className="flex items-center gap-2">
                    <span className="text-xs w-6">{star} ★</span>
                    <Progress value={percentage} className="w-full h-2" />
                    <span className="text-xs text-muted-foreground w-8 text-right">{count}</span>
                </div>
            ))}
        </div>
        
        <Card className="mt-8">
            <CardHeader>
                <CardTitle>Share your thoughts</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">If you have a minute, please leave a review. We'd love to hear from you!</p>
                <form onSubmit={handleReviewSubmit} className="mt-4 space-y-4">
                     <div>
                        <Label>Your Rating</Label>
                        <div className="flex items-center gap-1 mt-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    className={`h-6 w-6 cursor-pointer transition-colors ${
                                        (hoverRating || newReview.rating) >= star 
                                        ? 'text-amber-400 fill-amber-400' 
                                        : 'text-gray-300'
                                    }`}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    onClick={() => setNewReview({ ...newReview, rating: star })}
                                />
                            ))}
                        </div>
                     </div>
                     <div>
                        <Label htmlFor="review-title">Review Title</Label>
                        <Input 
                            id="review-title"
                            placeholder="e.g. Best avocados ever!"
                            value={newReview.title}
                            onChange={(e) => setNewReview({...newReview, title: e.target.value})}
                        />
                     </div>
                     <div>
                        <Label htmlFor="review-comment">Your Review</Label>
                        <Textarea 
                            id="review-comment"
                            placeholder="Write your detailed review here..."
                            value={newReview.comment}
                            onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                        />
                     </div>
                     <Button type="submit">Submit Review</Button>
                </form>
            </CardContent>
        </Card>
      </div>
      <div className="md:col-span-3">
         <h3 className="text-2xl font-bold font-headline mb-4">What others are saying</h3>
         <div className="space-y-6 max-h-[800px] overflow-y-auto pr-4">
            {reviews.map((review) => (
                <div key={review.id} className="flex gap-4">
                    <Avatar>
                        <AvatarImage src={review.avatar} />
                        <AvatarFallback>{review.author.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <div className="flex items-center justify-between">
                            <h4 className="font-semibold">{review.author}</h4>
                            <span className="text-xs text-muted-foreground">{review.date}</span>
                        </div>
                         <div className="flex items-center gap-1 mt-1">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} />
                            ))}
                        </div>
                        <h5 className="font-semibold mt-2">{review.title}</h5>
                        <p className="text-sm text-muted-foreground mt-1">{review.comment}</p>
                    </div>
                </div>
            ))}
         </div>
      </div>
    </div>
  );
}
