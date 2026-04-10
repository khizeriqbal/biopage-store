"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const TESTIMONIALS = [
  {
    id: 1,
    name: "Sarah Johnson",
    niche: "Digital Marketing",
    quote: "I made $12,450 in just 30 days selling my email templates!",
    metric: "487 sales",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
  },
  {
    id: 2,
    name: "Marcus Chen",
    niche: "Web Design",
    quote: "The AI bio generator saved me hours. My store looks professional instantly.",
    metric: "$8,320 revenue",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
  },
  {
    id: 3,
    name: "Emma Rodriguez",
    niche: "Fitness Coaching",
    quote: "0% commission means I keep everything I earn. Best platform ever!",
    metric: "156 active subscribers",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
  },
  {
    id: 4,
    name: "James Mitchell",
    niche: "Content Creation",
    quote: "The affiliate program is insane. I earned $3,200 just by promoting.",
    metric: "$45K+ promoted",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
  },
];

export function CreatorTestimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  useEffect(() => {
    if (!isAutoPlay) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [isAutoPlay]);

  const handlePrev = () => {
    setIsAutoPlay(false);
    setCurrentIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  const handleNext = () => {
    setIsAutoPlay(false);
    setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const getVisibleTestimonials = () => {
    const items = [];
    for (let i = 0; i < 3; i++) {
      items.push(TESTIMONIALS[(currentIndex + i) % TESTIMONIALS.length]);
    }
    return items;
  };

  return (
    <div className="w-full py-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Creator Success Stories
          </h2>
          <p className="text-muted-foreground">
            Join thousands of creators earning passive income
          </p>
        </div>

        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {getVisibleTestimonials().map((testimonial) => (
              <div
                key={testimonial.id}
                className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-brand/50 transition"
              >
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-white">{testimonial.name}</p>
                    <p className="text-xs text-brand">{testimonial.niche}</p>
                  </div>
                </div>

                <blockquote className="text-white/80 mb-4 italic">
                  "{testimonial.quote}"
                </blockquote>

                <div className="text-sm font-semibold text-brand">
                  {testimonial.metric}
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={handlePrev}
              className="h-10 w-10 rounded-lg bg-brand/10 border border-brand/20 flex items-center justify-center hover:bg-brand/20 transition"
              aria-label="Previous testimonials"
            >
              <ChevronLeft className="w-5 h-5 text-brand" />
            </button>

            <div className="flex gap-2">
              {TESTIMONIALS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setIsAutoPlay(false);
                    setCurrentIndex(idx);
                  }}
                  className={`h-2 rounded-full transition ${
                    idx === currentIndex
                      ? "w-8 bg-brand"
                      : "w-2 bg-white/20 hover:bg-white/40"
                  }`}
                  aria-label={`Go to testimonial ${idx + 1}`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="h-10 w-10 rounded-lg bg-brand/10 border border-brand/20 flex items-center justify-center hover:bg-brand/20 transition"
              aria-label="Next testimonials"
            >
              <ChevronRight className="w-5 h-5 text-brand" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
