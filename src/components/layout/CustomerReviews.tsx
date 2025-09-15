
'use client'

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import { cn } from '@/lib/utils';

const reviews = [
  {
    name: "Sarah L.",
    role: "Customer",
    avatar: "https://i.pravatar.cc/150?img=1",
    rating: 5,
    comment: "The produce is always so fresh and vibrant! I love knowing I'm feeding my family the best local and organic food. The customer service is also top-notch.",
  },
  {
    name: "David M.",
    role: "Customer",
    avatar: "https://i.pravatar.cc/150?img=2",
    rating: 5,
    comment: "Aotearoa Organics has completely changed the way we eat. The weekly boxes are a fantastic surprise and have introduced us to so many new vegetables.",
  },
  {
    name: "Jessica P.",
    role: "Customer",
    avatar: "https://i.pravatar.cc/150?img=3",
    rating: 4,
    comment: "I'm so impressed with the quality and flavor. You can really taste the difference compared to supermarket produce. Highly recommend their services!",
  },
   {
    name: "Tom H.",
    role: "Customer",
    avatar: "https://i.pravatar.cc/150?img=4",
    rating: 5,
    comment: "Fantastic service and even better produce. The delivery is always on time, and the fruits and veggies are packed with care. A pleasure to deal with.",
  },
];

function renderStars(rating: number) {
    const totalStars = 5;
    return (
        <div className="flex items-center gap-0.5">
            {[...Array(totalStars)].map((_, i) => (
                <Star
                    key={i}
                    className={cn(
                        'w-4 h-4',
                        i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                    )}
                />
            ))}
        </div>
    );
}

export function CustomerReviews() {
  return (
    <div className="container mx-auto px-4">
      <h2 className="text-3xl font-bold text-center font-headline relative pb-4">
        What Our Customers Say
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-1 bg-primary"></div>
      </h2>
      <p className="mt-4 text-center text-muted-foreground max-w-xl mx-auto">
        Hear from our happy customers and find out why they love our fresh, organic produce.
      </p>
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full max-w-4xl mx-auto mt-12"
      >
        <CarouselContent>
          {reviews.map((review, index) => (
            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
              <div className="p-4">
                <Card>
                  <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                    <Avatar className="w-20 h-20 mb-4 border-2 border-primary/50">
                      <AvatarImage src={review.avatar} alt={review.name} />
                      <AvatarFallback>{review.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <p className="text-muted-foreground italic">&quot;{review.comment}&quot;</p>
                    <div className="mt-4 flex items-center gap-2">
                        {renderStars(review.rating)}
                    </div>
                    <p className="font-bold mt-4">{review.name}</p>
                    <p className="text-xs text-muted-foreground">{review.role}</p>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2 z-10 hidden md:flex" />
        <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2 z-10 hidden md:flex" />
      </Carousel>
    </div>
  );
}
