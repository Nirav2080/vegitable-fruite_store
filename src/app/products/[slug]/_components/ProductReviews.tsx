
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
import { addReview } from '@/lib/actions/reviews';
import { format } from 'date-fns';


interface ProductReviewsProps {
  product: Product;
}

export function ProductReviews({ product }: ProductReviewsProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 0, title: '', comment: '' });
  const [hoverRating, setHoverRating] = useState(0);

  const reviews = Array.isArray(product.reviews) ? product.reviews : [];
  const averageRating = reviews.length > 0 ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length : 0;
  
  const ratingDistribution = [5, 4, 3, 2, 1].map(star => {
    const count = reviews.filter(r => r.rating === star).length;
    const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
    return { star, count, percentage };
  });

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newReview.rating === 0 || !newReview.title || !newReview.comment) {
      toast({
        title: "Incomplete review",
        description: "Please provide a rating, title, and comment.",
        variant: "destructive"
      });
      return;
    }
    setIsSubmitting(true);
    try {
      await addReview(product.id, newReview);
      toast({
        title: "Review submitted",
        description: "Thank you for your feedback!",
      });
      setNewReview({ rating: 0, title: '', comment: '' });
      router.refresh();
    } catch (error) {
      console.error(error);
      toast({
        title: "Error submitting review",
        description: error instanceof Error ? error.message : "An unexpected error occurred.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="grid md:grid-cols-5 gap-8">
      <div className="md:col-span-2">
        <h3 className="text-2xl font-bold font-headline mb-4">Customer Reviews</h3>
        {reviews.length > 0 ? (
          <>
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
              {ratingDistribution.map(({ star, count, percentage }) => (
                <div key={star} className="flex items-center gap-2">
                  <span className="text-xs w-6">{star} ★</span>
                  <Progress value={percentage} className="w-full h-2" />
                  <span className="text-xs text-muted-foreground w-8 text-right">{count}</span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">This product has no reviews yet.</p>
        )}
        
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
                     <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Submitting...' : 'Submit Review'}
                     </Button>
                </form>
            </CardContent>
        </Card>
      </div>
      <div className="md:col-span-3">
         <h3 className="text-2xl font-bold font-headline mb-4">What others are saying</h3>
         <div className="space-y-6 max-h-[800px] overflow-y-auto pr-4">
            {reviews.length > 0 ? reviews.map((review) => (
                <div key={review.id} className="flex gap-4">
                    <Avatar>
                        <AvatarImage src={review.avatar} />
                        <AvatarFallback>{review.author.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <div className="flex items-center justify-between">
                            <h4 className="font-semibold">{review.author}</h4>
                            <span className="text-xs text-muted-foreground">{format(new Date(review.date), 'dd MMM yyyy')}</span>
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
            )) : (
              <p className="text-sm text-muted-foreground text-center py-8">Be the first to review this product!</p>
            )}
         </div>
      </div>
    </div>
  );
}
