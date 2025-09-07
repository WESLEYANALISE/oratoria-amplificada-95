import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious,
  type CarouselApi 
} from "@/components/ui/carousel";
import { BookOpen, Star, Zap, Crown } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";

interface Book {
  id: number;
  livro: string;
  resumo: string;
  capa: string;
}

interface BookCarouselProps {
  books: Book[];
  onPurchase: () => void;
}

const BookCarousel = ({ books, onPurchase }: BookCarouselProps) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  const scrollToSlide = useCallback((index: number) => {
    api?.scrollTo(index);
  }, [api]);

  return (
    <div className="w-full max-w-7xl mx-auto relative">
      {/* Carousel Header */}
      <div className="text-center mb-12">
        <Badge className="bg-gold/20 text-gold border-gold/30 px-6 py-3 text-lg font-bold mb-6 animate-gold-pulse">
          📚 BIBLIOTECA COMPLETA DE ORATÓRIA
        </Badge>
        <h2 className="text-4xl md:text-5xl font-black mb-6 animate-fade-in-up">
          Sua <span className="text-gold">Transformação</span> Começa Aqui
        </h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto animate-fade-in-up [animation-delay:0.2s]">
          10 livros estrategicamente selecionados para você dominar a arte da comunicação persuasiva
        </p>
      </div>

      {/* Main Carousel */}
      <Carousel
        setApi={setApi}
        className="w-full"
        opts={{
          align: "start",
          loop: true,
        }}
        plugins={[
          Autoplay({
            delay: 4000,
            stopOnInteraction: true,
            stopOnMouseEnter: true,
          }),
        ]}
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {books.map((book, index) => (
            <CarouselItem key={book.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
              <Card className="h-full hover-book-card bg-card/50 backdrop-blur-sm border-border/50 overflow-hidden group">
                <CardContent className="p-0">
                  {/* Layout Horizontal Mobile, Vertical Desktop */}
                  <div className="flex flex-col md:flex-row h-full">
                    {/* Book Cover */}
                    <div className="relative md:w-40 lg:w-48 flex-shrink-0">
                      <div className="aspect-[3/4] md:h-full relative overflow-hidden">
                        <img 
                          src={book.capa} 
                          alt={book.livro}
                          className="book-cover w-full h-full object-cover transition-transform duration-500"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        
                        {/* Book Number Badge */}
                        <Badge className="absolute top-3 left-3 bg-gold text-gold-foreground px-3 py-1 text-sm font-bold">
                          #{String(index + 1).padStart(2, '0')}
                        </Badge>

                        {/* Star Rating */}
                        <div className="absolute bottom-3 left-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Book Info */}
                    <div className="book-info flex-1 p-6 flex flex-col justify-between transition-transform duration-300">
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <BookOpen className="w-5 h-5 text-gold" />
                          <Badge variant="outline" className="text-xs border-gold/30 text-gold">
                            eBook Premium
                          </Badge>
                        </div>
                        
                        <h3 className="text-lg md:text-xl font-bold mb-3 leading-tight group-hover:text-gold transition-colors duration-300">
                          {book.livro}
                        </h3>
                        
                        <p className="text-muted-foreground text-sm md:text-base leading-relaxed mb-4 line-clamp-3">
                          {book.resumo}
                        </p>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col gap-3 mt-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Zap className="w-4 h-4 text-gold" />
                          <span>Acesso Imediato</span>
                        </div>
                        
                        <Button 
                          onClick={onPurchase}
                          className="cta-secondary w-full text-sm py-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0"
                        >
                          <Crown className="w-4 h-4 mr-2" />
                          Incluído no Pacote
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        {/* Navigation Arrows */}
        <div className="absolute -left-4 md:-left-12 top-1/2 -translate-y-1/2">
          <CarouselPrevious className="relative left-0 top-0 translate-y-0 h-12 w-12 border-2 border-gold/30 bg-background/80 backdrop-blur-sm hover:bg-gold hover:border-gold text-gold hover:text-gold-foreground transition-all duration-300" />
        </div>
        <div className="absolute -right-4 md:-right-12 top-1/2 -translate-y-1/2">
          <CarouselNext className="relative right-0 top-0 translate-y-0 h-12 w-12 border-2 border-gold/30 bg-background/80 backdrop-blur-sm hover:bg-gold hover:border-gold text-gold hover:text-gold-foreground transition-all duration-300" />
        </div>
      </Carousel>

      {/* Carousel Indicators */}
      <div className="flex justify-center gap-2 mt-8">
        {Array.from({ length: count }, (_, index) => (
          <button
            key={index}
            onClick={() => scrollToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              current === index + 1 
                ? 'bg-gold scale-125 shadow-gold' 
                : 'bg-border hover:bg-gold/50 hover:scale-110'
            }`}
            aria-label={`Ir para slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Call to Action */}
      <div className="text-center mt-12 animate-slide-in-bottom">
        <Button 
          onClick={onPurchase}
          className="cta-primary text-xl px-12 py-6 rounded-2xl animate-gold-pulse"
        >
          <Crown className="w-6 h-6 mr-3" />
          Quero Falar sem Medo
          <Zap className="w-6 h-6 ml-3" />
        </Button>
        <p className="text-sm text-muted-foreground mt-4">
          ⚡ Acesso instantâneo após o pagamento
        </p>
      </div>
    </div>
  );
};

export default BookCarousel;