
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { addReview } from '@/lib/actions/reviews';
import type { Review } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star } from 'lucide-react';
import { AuthError } from '@/lib/exceptions';

const reviewSchema = z.object({
  rating: z.coerce.number().min(1, 'Rating is required').max(5),
  title: z.string().min(1, 'Title is required').max(100),
  comment: z.string().min(1, 'Comment is required').max(1000),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

interface ProductReviewsProps {
  productId: string;
  reviews: Review[];
}

function renderStars(rating: number, interactive = false, setRating?: (rating: number) => void) {
    const totalStars = 5;
    return (
        <div className={`flex items-center gap-1 ${interactive ? 'cursor-pointer' : ''}`}>
            {[...Array(totalStars)].map((_, i) => (
                <Star
                    key={i}
                    className={`w-5 h-5 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} ${interactive ? 'hover:text-yellow-400 hover:fill-yellow-400' : ''}`}
                    onClick={interactive && setRating ? () => setRating(i + 1) : undefined}
                />
            ))}
        </div>
    );
}

export function ProductReviews({ productId, reviews }: ProductReviewsProps) {
  const { toast } = useToast();
  const [rating, setRating] = useState(0);

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      title: '',
      comment: '',
    },
  });
  
  const { formState: { isSubmitting }, setValue } = form;

  const handleSetRating = (newRating: number) => {
      setRating(newRating);
      setValue('rating', newRating, { shouldValidate: true });
  }

  async function onSubmit(data: ReviewFormValues) {
    try {
      await addReview(productId, data);
      toast({
        title: 'Review Submitted',
        description: 'Thank you! Your review has been submitted successfully.',
      });
      form.reset();
      setRating(0);
    } catch (error) {
      if (error instanceof AuthError) {
        toast({
            title: 'Authentication Error',
            description: 'You must be logged in to post a review.',
            variant: 'destructive',
        });
      } else {
        toast({
            title: 'Submission Failed',
            description: 'There was an error submitting your review. Please try again.',
            variant: 'destructive',
        });
      }
    }
  }

  return (
    <div className="grid md:grid-cols-2 gap-12">
        <div>
            <h3 className="text-2xl font-bold tracking-tight mb-6">Customer Reviews</h3>
            {reviews.length > 0 ? (
                <div className="space-y-6">
                    {reviews.map((review) => (
                        <div key={review._id.toString()} className="flex gap-4 p-4 rounded-2xl border border-border/30 transition-all duration-300 hover:shadow-sm">
                            <Avatar className="ring-1 ring-border/30">
                                <AvatarImage src={review.avatar} alt={review.author}/>
                                <AvatarFallback className="bg-primary/10 text-primary">{review.author.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <div className="flex items-center justify-between">
                                    <h4 className="font-semibold">{review.author}</h4>
                                    <span className="text-xs text-muted-foreground">{format(new Date(review.date), 'dd MMM yyyy')}</span>
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                    {renderStars(review.rating)}
                                    <p className="font-bold text-sm">{review.title}</p>
                                </div>
                                <p className="text-muted-foreground mt-2 text-sm">{review.comment}</p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-muted-foreground">This product has no reviews yet. Be the first to leave one!</p>
            )}
        </div>
        <div>
            <h3 className="text-2xl font-bold tracking-tight mb-4">Write a Review</h3>
             <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                     <FormField
                        control={form.control}
                        name="rating"
                        render={() => (
                           <FormItem>
                                <FormLabel>Your Rating</FormLabel>
                                <FormControl>
                                    <div>{renderStars(rating, true, handleSetRating)}</div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Review Title</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. Best apples ever!" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="comment"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Your Review</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Share your thoughts on this product..." rows={4} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" disabled={isSubmitting} className="rounded-xl shadow-sm transition-all duration-300">
                        {isSubmitting ? 'Submitting...' : 'Submit Review'}
                    </Button>
                </form>
            </Form>
        </div>
    </div>
  );
}
