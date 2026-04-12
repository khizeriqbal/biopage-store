import { Metadata } from "next";
import { Star, Trash2, Edit2, Plus, MessageCircle } from "lucide-react";

export const metadata: Metadata = {
    title: "Testimonials | Creator Dashboard",
};

// Placeholder testimonials data
const testimonials = [
    {
        id: "1",
        authorName: "Sarah Johnson",
        authorTitle: "Digital Creator",
        rating: 5,
        text: "This course completely transformed my business. The strategies are practical and immediately applicable.",
        productName: "Growth Masterclass",
        dateAdded: "2024-04-05",
        verified: true,
    },
    {
        id: "2",
        authorName: "Michael Chen",
        authorTitle: "Entrepreneur",
        rating: 5,
        text: "Best investment I've made this year. The ROI was immediate and the community support is incredible.",
        productName: "Growth Masterclass",
        dateAdded: "2024-04-02",
        verified: true,
    },
];

export default function TestimonialsPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-black text-white mb-2">Testimonials & Reviews</h1>
                <p className="text-muted-foreground">Display customer testimonials to boost credibility</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card-modern">
                    <p className="text-sm text-muted-foreground mb-1">Total Testimonials</p>
                    <h3 className="text-3xl font-black text-white">{testimonials.length}</h3>
                    <p className="text-xs text-blue-400 mt-2">Customer reviews</p>
                </div>

                <div className="card-modern">
                    <p className="text-sm text-muted-foreground mb-1">Average Rating</p>
                    <h3 className="text-3xl font-black text-yellow-400">4.7</h3>
                    <p className="text-xs text-yellow-400 mt-2">Out of 5 stars</p>
                </div>

                <div className="card-modern">
                    <p className="text-sm text-muted-foreground mb-1">Verified Reviews</p>
                    <h3 className="text-3xl font-black text-emerald-400">{testimonials.filter(t => t.verified).length}</h3>
                    <p className="text-xs text-emerald-400 mt-2">Verified only</p>
                </div>
            </div>

            <button className="w-full card-modern border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10 transition">
                <div className="flex items-center gap-3 py-4 px-6">
                    <Plus className="h-5 w-5 text-emerald-400" />
                    <span className="font-semibold text-emerald-400">Add New Testimonial</span>
                </div>
            </button>

            <div className="card-modern overflow-hidden">
                <h3 className="font-bold text-white text-lg mb-4">Your Testimonials</h3>
                <div className="space-y-4">
                    {testimonials.map((testimonial) => (
                        <div key={testimonial.id} className="p-4 rounded-lg bg-slate-700/20 border border-white/10">
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <h4 className="font-semibold text-white">{testimonial.authorName}</h4>
                                    <p className="text-xs text-muted-foreground">{testimonial.productName}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30">
                                        <Edit2 className="h-4 w-4" />
                                    </button>
                                    <button className="p-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30">
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                            <p className="text-sm text-white/80">{testimonial.text}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}