
import { Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const testimonials = [
  {
    name: "Sarah M.",
    review: "The produce is always so fresh and crisp! It's like having a farmer's market delivered to my door. The quality is unmatched.",
    rating: 5,
    avatar: "https://api.dicebear.com/8.x/avataaars/svg?seed=Sarah"
  },
  {
    name: "John D.",
    review: "Aotearoa Organics has changed the way my family eats. The organic boxes are fantastic value and always full of surprises.",
    rating: 5,
    avatar: "https://api.dicebear.com/8.x/avataaars/svg?seed=John"
  },
  {
    name: "Emily R.",
    review: "I love the convenience and the quality. The delivery is always on time, and the fruits and vegetables last so much longer than from the supermarket.",
    rating: 5,
    avatar: "https://api.dicebear.com/8.x/avataaars/svg?seed=Emily"
  }
];

function renderStars(rating: number) {
    const totalStars = 5;
    return (
        <div className="flex items-center gap-1">
            {[...Array(totalStars)].map((_, i) => (
                <Star
                    key={i}
                    className={`w-5 h-5 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                />
            ))}
        </div>
    );
}

export function TestimonialsSection() {
  return (
    <section className="bg-secondary/50 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold font-headline">What Our Customers Say</h2>
          <p className="text-muted-foreground mt-2">Real reviews from happy customers.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.name} className="bg-background p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
              <Avatar className="w-20 h-20 mb-4">
                <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="mb-2">{renderStars(testimonial.rating)}</div>
              <p className="text-muted-foreground italic">"{testimonial.review}"</p>
              <p className="font-semibold mt-4">{testimonial.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
