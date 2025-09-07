import { useEffect, useRef } from "react";
import { Badge } from "@/components/ui/badge";

interface Book {
  id: number;
  livro: string;
  resumo: string;
  capa: string;
  audio: string | null;
}

interface InfiniteBookCarouselProps {
  books: Book[];
}

const InfiniteBookCarousel = ({ books }: InfiniteBookCarouselProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer || books.length === 0) return;

    let animationId: number;
    let scrollPosition = 0;
    const scrollSpeed = 0.5; // pixels per frame

    const animate = () => {
      if (scrollContainer) {
        scrollPosition += scrollSpeed;
        
        // Reset position when we've scrolled past the first set of books
        const cardWidth = 200; // approximate width of each book card
        const totalWidth = cardWidth * books.length;
        
        if (scrollPosition >= totalWidth) {
          scrollPosition = 0;
        }
        
        scrollContainer.scrollLeft = scrollPosition;
      }
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    // Pause animation on hover
    const handleMouseEnter = () => {
      cancelAnimationFrame(animationId);
    };

    const handleMouseLeave = () => {
      animationId = requestAnimationFrame(animate);
    };

    scrollContainer.addEventListener('mouseenter', handleMouseEnter);
    scrollContainer.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationId);
      scrollContainer?.removeEventListener('mouseenter', handleMouseEnter);
      scrollContainer?.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [books]);

  // Duplicate books array to create infinite effect
  const duplicatedBooks = [...books, ...books, ...books];

  return (
    <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] overflow-hidden bg-gradient-to-r from-background via-primary/5 to-background py-8">
      <div className="text-center mb-6">
        <Badge className="bg-gold/20 text-gold border-gold/30 px-4 py-2 text-sm font-bold animate-gold-pulse">
          📚 BIBLIOTECA COMPLETA
        </Badge>
      </div>
      
      <div 
        ref={scrollRef}
        className="flex gap-4 overflow-hidden scrollbar-hide"
        style={{ 
          scrollBehavior: 'unset',
          msOverflowStyle: 'none',
          scrollbarWidth: 'none'
        }}
      >
        {duplicatedBooks.map((book, index) => (
          <div
            key={`${book.id}-${index}`}
            className="flex-shrink-0 w-40 sm:w-48 group cursor-pointer"
          >
            <div className="relative overflow-hidden rounded-lg shadow-lg hover-lift">
              <img
                src={book.capa}
                alt={book.livro}
                className="w-full h-52 sm:h-60 object-cover transition-transform duration-300 group-hover:scale-110"
                loading="lazy"
              />
              
              {/* Overlay with book info */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <h3 className="text-sm font-bold text-foreground mb-1 line-clamp-2">
                    {book.livro}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {book.resumo}
                  </p>
                </div>
              </div>
              
              {/* Golden corner badge */}
              <div className="absolute top-2 right-2">
                <div className="w-3 h-3 bg-gold rounded-full animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="text-center mt-4">
        <p className="text-sm text-muted-foreground">
          ⚡ 10 eBooks Premium de Oratória
        </p>
      </div>
    </div>
  );
};

export default InfiniteBookCarousel;