'use client'

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import { cn } from '@/lib/utils';

const reviews = [
  {
    name: "Byron Watts",
    avatar: "https://i.pravatar.cc/150?img=1",
    rating: 5,
    comment: "Contrary to popular belief, Lorem Ipsu not simply random text. It has roots in piece of classical Latin literature from",
  },
  {
    name: "Jhon Marker",
    avatar: "https://i.pravatar.cc/150?img=2",
    rating: 5,
    comment: "Contrary to popular belief, Lorem Ipsu not simply random text. It has roots in piece of classical Latin literature from",
  },
  {
    name: "Celeste Estrada",
    avatar: "https://i.pravatar.cc/150?img=3",
    rating: 4,
    comment: "Contrary to popular belief, Lorem Ipsu not simply random text. It has roots in piece of classical Latin literature from",
  },
   {
    name: "Cameaila Cablle",
    avatar: "https://i.pravatar.cc/150?img=4",
    rating: 5,
    comment: "Contrary to popular belief, Lorem Ipsu not simply random text. It has roots in piece of classical Latin literature from",
  },
];

function renderStars(rating: number) {
    const totalStars = 5;
    return (
        <div className="flex items-center gap-1">
            {[...Array(totalStars)].map((_, i) => (
                <div key={i} className='relative'>
                    <Star
                        className={cn(
                            'w-5 h-5',
                            i < rating ? 'text-blue-500 fill-blue-500' : 'text-gray-300'
                        )}
                    />
                </div>
            ))}
        </div>
    );
}

export function CustomerReviews() {
  return (
    <div className="container mx-auto px-4">
      <h2 className="text-3xl font-bold text-center font-headline relative pb-4">
        See What Our Customers Says
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-1 bg-primary"></div>
      </h2>
      
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full max-w-6xl mx-auto mt-12"
      >
        <CarouselContent className="-ml-4">
          {reviews.map((review, index) => (
            <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
              <div className="p-1">
                <Card className="h-full">
                  <CardContent className="flex flex-col justify-between h-full p-6 text-left">
                    <div className="flex-grow">
                        {renderStars(review.rating)}
                        <p className="text-muted-foreground text-sm mt-4">&quot;{review.comment}&quot;</p>
                    </div>
                    <div className="flex items-center gap-3 mt-6 pt-6 border-t">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={review.avatar} alt={review.name} />
                          <AvatarFallback>{review.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-semibold">{review.name}</p>
                        </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-[-2rem] top-1/2 -translate-y-1/2 z-10 hidden md:flex" />
        <CarouselNext className="absolute right-[-2rem] top-1/2 -translate-y-1/2 z-10 hidden md:flex" />
      </Carousel>
    </div>
  );
}
