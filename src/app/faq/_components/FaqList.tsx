'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { faqItems } from '@/lib/static-pages-content';

export function FaqList() {
  return (
    <Accordion type="single" collapsible className="w-full rounded-2xl border border-border/30 bg-card px-4 sm:px-6">
      {faqItems.map((item, index) => (
        <AccordionItem key={item.question} value={`item-${index}`}>
          <AccordionTrigger className="text-left text-sm sm:text-base font-medium hover:no-underline py-4 sm:py-5">
            {item.question}
          </AccordionTrigger>
          <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4 sm:pb-5">
            {item.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
