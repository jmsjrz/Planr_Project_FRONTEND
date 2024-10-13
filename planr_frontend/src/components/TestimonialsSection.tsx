// /components/TestimonialsSection.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";

export function TestimonialsSection() {
  const testimonials = [
    {
      name: "Marie L.",
      text: "Planr a révolutionné la façon dont j'organise mes événements. C'est tellement simple et intuitif !",
    },
    {
      name: "Pierre D.",
      text: "La fonction de messagerie intégrée est géniale. Je peux facilement communiquer avec tous mes invités.",
    },
    {
      name: "Camille F.",
      text: "Les notifications en temps réel sont un vrai plus. Je ne rate plus jamais un événement important.",
    },
  ];

  return (
    <section className="py-20">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
        Ce que disent nos utilisateurs
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((testimonial, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>
                <div className="flex items-center">
                  <Star className="text-yellow-400 mr-1" />
                  <Star className="text-yellow-400 mr-1" />
                  <Star className="text-yellow-400 mr-1" />
                  <Star className="text-yellow-400 mr-1" />
                  <Star className="text-yellow-400" />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">{testimonial.text}</p>
              <p className="font-semibold">{testimonial.name}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
