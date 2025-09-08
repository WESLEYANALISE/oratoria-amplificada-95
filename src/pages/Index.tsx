import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import InfiniteBookCarousel from "@/components/InfiniteBookCarousel";
import AudioPlayer from "@/components/AudioPlayer";
import CustomVideoPlayer from "@/components/CustomVideoPlayer";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Mic, Crown, Users, Star, Shield, Clock, ChevronRight, Play, BookOpen, Award, Target, Zap, CheckCircle, TrendingUp } from "lucide-react";
interface Book {
  id: number;
  livro: string;
  resumo: string;
  capa: string;
  audio: string | null;
}
const Index = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasPlayedVideo, setHasPlayedVideo] = useState(false);
  const [firstAudioPlayed, setFirstAudioPlayed] = useState(false);
  const [pauseVideo, setPauseVideo] = useState(0);
  
  const handleButtonClick = () => {
    setPauseVideo(prev => prev + 1);
    window.open('https://pay.cakto.com.br/377wp2j_560310', '_blank');
  };
  
  const booksRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // All scroll animations at the top level
  const booksHeaderAnimation = useScrollAnimation();
  const benefitsHeaderAnimation = useScrollAnimation();
  
  // Create animations for books (assuming max 20 books)
  const bookAnimations = Array.from({ length: 20 }, (_, index) => 
    useScrollAnimation({ delay: index * 100 })
  );
  
  // Create animations for benefits (3 items)
  const benefitAnimations = Array.from({ length: 3 }, (_, index) => 
    useScrollAnimation({ delay: index * 200 })
  );

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const {
          data,
          error
        } = await supabase.from('VENDER-ORATORIA').select('*').order('id');
        if (error) throw error;
        setBooks(data || []);
      } catch (error) {
        console.error('Erro ao carregar livros:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();

    // Check if video has been played before
    const videoPlayed = localStorage.getItem('hero-video-played');
    if (videoPlayed) {
      setHasPlayedVideo(true);
    }

    // Add event listener to pause all audio when video starts playing
    const handleVideoPlay = () => {
      const allAudio = document.querySelectorAll('audio');
      allAudio.forEach(audio => {
        if (!audio.paused) {
          audio.pause();
        }
      });
    };

    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.addEventListener('play', handleVideoPlay);
      
      return () => {
        videoElement.removeEventListener('play', handleVideoPlay);
      };
    }
  }, []);
  
  const handlePurchase = () => {
    window.open('https://pay.cakto.com.br/377wp2j_560310', '_blank');
  };

  const handleScrollToBooks = () => {
    // Pause the video if it's playing
    if (videoRef.current) {
      videoRef.current.pause();
    }

    // Smooth scroll to books section
    if (booksRef.current) {
      booksRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });

      // Auto-play first book audio after scroll animation
      setTimeout(() => {
        if (!firstAudioPlayed && books.length > 0 && books[0].audio) {
          const firstAudio = document.querySelector('audio') as HTMLAudioElement;
          if (firstAudio) {
            firstAudio.play().catch(console.error);
            setFirstAudioPlayed(true);
          }
        }
      }, 1000);
    }
  };

  const handleScrollToPurchase = () => {
    const purchaseSection = document.querySelector('#purchase-section');
    if (purchaseSection) {
      purchaseSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };
  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse">
          <Mic className="w-12 h-12 text-gold" />
        </div>
      </div>;
  }
  return <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden gradient-hero min-h-screen flex items-center">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gold/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-primary-glow/20 rounded-full blur-3xl animate-float [animation-delay:3s]" />
          <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-gold/10 rounded-full blur-2xl animate-rotate-slow" />
          <div className="absolute top-3/4 left-1/6 w-24 h-24 bg-gold/15 rounded-full blur-xl animate-bounce-slow [animation-delay:1s]" />
        </div>
        
        <div className="container mx-auto px-4 py-12 sm:py-16 md:py-20 lg:py-24 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
              <Badge className="mb-4 sm:mb-6 bg-gold/20 text-gold border-gold/30 px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-bold animate-gold-pulse animate-wiggle">
                🔥 OFERTA LIMITADA - APENAS 48 HORAS
              </Badge>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black mb-6 sm:mb-8 leading-tight animate-fade-in-up">
              <span className="bg-gradient-to-r from-foreground via-gold to-primary-glow bg-clip-text text-transparent">
                Você não precisa deixar o medo de falar em público roubar suas chances de crescer.
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-4 sm:mb-6 leading-relaxed animate-fade-in-up [animation-delay:0.2s] px-4">
              Transforme <strong className="text-gold">Qualquer Palavra</strong> em Uma Arma de Influência
            </p>
            
            <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8 max-w-3xl mx-auto animate-fade-in-up [animation-delay:0.4s] px-4">Pare de ser ignorado. Pare de perder oportunidades por não saber se comunicar.</p>
            
            {/* Video Section */}
            <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] mb-8 sm:mb-12 animate-fade-in-up [animation-delay:0.6s] px-2 sm:px-4">
              <div className="relative rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl bg-card/10 backdrop-blur-sm border border-gold/20 hover-lift max-w-5xl mx-auto">
                <CustomVideoPlayer
                  src="/video-novo-atualizado.mp4"
                  showControls={false}
                  onPlay={() => {
                    if (!hasPlayedVideo) {
                      localStorage.setItem('hero-video-played', 'true');
                      setHasPlayedVideo(true);
                    }
                  }}
                />
              </div>
            </div>
            
            {/* Infinite Book Carousel */}
            <div className="mb-8 sm:mb-12 animate-slide-in-bottom">
              <InfiniteBookCarousel books={books} />
            </div>
            
            {/* Impact Quote */}
            <div className="mb-8 sm:mb-12 animate-fade-in text-center px-4">
              <div className="bg-gradient-to-r from-gold/10 via-gold/20 to-gold/10 rounded-2xl p-6 sm:p-8 border border-gold/30 shadow-2xl shadow-gold/20 max-w-4xl mx-auto">
                <div className="text-2xl sm:text-3xl md:text-4xl font-black text-gold mb-2 leading-tight">
                  "Mais de 70% das oportunidades de crescimento profissional
                </div>
                <div className="text-xl sm:text-2xl md:text-3xl font-black text-gold leading-tight">
                  estão ligadas a uma boa comunicação."
                </div>
                <div className="w-16 h-1 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mt-4"></div>
              </div>
            </div>
            
            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-12 mb-8 sm:mb-12 animate-slide-in-bottom px-4">
              {[{
              icon: <Users className="w-5 h-5 sm:w-6 sm:h-6" />,
              label: "+50.000",
              desc: "Pessoas"
            }, {
              icon: <Star className="w-5 h-5 sm:w-6 sm:h-6" />,
              label: "4.9/5",
              desc: "Avaliação"
            }, {
              icon: <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />,
              label: "10",
              desc: "eBooks"
            }].map((stat, index) => <div key={index} className="text-center">
                  <div className="flex items-center justify-center text-gold mb-2">
                    {stat.icon}
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-gold">{stat.label}</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">{stat.desc}</div>
                </div>)}
            </div>
            
            <div className="flex justify-center mb-6 sm:mb-8">
              <Button onClick={handleScrollToBooks} className="cta-primary text-base sm:text-lg lg:text-xl px-8 sm:px-12 lg:px-16 py-5 sm:py-6 lg:py-7 rounded-xl shadow-gold hover-glow animate-gold-pulse hover-scale animate-bounce animate-glow-pulse">
                <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 mr-2 sm:mr-3" />
                Sobre os Livros
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 ml-2 sm:mr-3" />
              </Button>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground animate-fade-in-up [animation-delay:0.8s] px-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-gold" />
                <span>Acesso Imediato</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-gold" />
                <span>Garantia 7 dias</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-gold" />
                <span>Suporte Completo</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Books Grid Section */}
      <section ref={booksRef} className="py-6 sm:py-8 md:py-12 bg-background relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
        <div className="absolute top-20 left-10 w-32 h-32 bg-gold/10 rounded-full blur-3xl animate-parallax-float" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl animate-parallax-float [animation-delay:2s]" />
        
        <div className="container mx-auto px-3 sm:px-4 relative z-10">
          <div className="text-center mb-6 sm:mb-8">
            <div ref={booksHeaderAnimation.ref} className={booksHeaderAnimation.className} style={booksHeaderAnimation.style}>
              <Badge className="bg-gold/20 text-gold border-gold/30 px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-lg font-bold mb-3 sm:mb-4 animate-gold-pulse animate-float">
                📚 BIBLIOTECA COMPLETA DE ORATÓRIA
              </Badge>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-3 sm:mb-4 px-2">
                Transforme Sua <span className="text-gold">Comunicação</span> com Estes Livros
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto px-4">
                10 livros estrategicamente selecionados para você dominar a arte da comunicação persuasiva
              </p>
            </div>
          </div>

          {/* Optimized compact grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 max-w-6xl mx-auto">
            {books.map((book, index) => {
              const animation = bookAnimations[index] || bookAnimations[0];
              return <div key={book.id} ref={animation.ref} className={`group hover-scale ${animation.className}`} style={animation.style}>
                <div className="bg-card/60 backdrop-blur-sm border border-border/50 rounded-xl p-4 hover-lift transition-all duration-500 h-full relative overflow-hidden animate-glow-pulse hover:animate-heartbeat">
                  <div className="flex gap-4 h-full">
                    {/* Book Cover - Compact */}
                    <div className="relative w-24 sm:w-28 flex-shrink-0">
                      <div className="aspect-[3/4] relative overflow-hidden rounded-lg">
                        <img src={book.capa} alt={book.livro} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
                        <Badge className="absolute top-1 left-1 bg-gold text-gold-foreground px-1.5 py-0.5 text-xs font-bold">
                          #{String(index + 1).padStart(2, '0')}
                        </Badge>
                        <div className="absolute inset-0 bg-gradient-to-t from-gold/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      </div>
                    </div>

                    {/* Book Info - Compact */}
                    <div className="flex-1 flex flex-col justify-between min-h-0">
                      {/* Header Info */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-3 h-3 text-gold flex-shrink-0" />
                          <Badge variant="outline" className="text-xs border-gold/30 text-gold px-2 py-0.5">
                            eBook Premium
                          </Badge>
                        </div>
                        
                        <h3 className="text-sm sm:text-base font-bold leading-tight group-hover:text-gold transition-colors duration-300 line-clamp-2">
                          {book.livro}
                        </h3>
                        
                        <div>
                          <h4 className="text-xs font-semibold text-gold mb-1">📖 Sobre este livro:</h4>
                          <p className="text-muted-foreground text-xs leading-relaxed line-clamp-2">
                            {book.resumo}
                          </p>
                        </div>
                      </div>

                      {/* Audio Player - Inline */}
                      {book.audio && (
                        <div className="mt-2">
                          <AudioPlayer 
                            audioUrl={book.audio} 
                            bookTitle={book.livro} 
                            className="w-full"
                          />
                        </div>
                      )}

                      {/* Benefits - Compact */}
                      <div>
                        <h4 className="text-xs font-semibold text-gold mb-2">✨ 3 Benefícios principais:</h4>
                        <div className="space-y-1 text-xs text-muted-foreground">
                          {index % 3 === 0 && (
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <CheckCircle className="w-3 h-3 text-gold flex-shrink-0" />
                                <span className="line-clamp-1">Domine técnicas de persuasão avançada</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <CheckCircle className="w-3 h-3 text-gold flex-shrink-0" />
                                <span className="line-clamp-1">Controle total da ansiedade e nervosismo</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <CheckCircle className="w-3 h-3 text-gold flex-shrink-0" />
                                <span className="line-clamp-1">Desenvolva carisma e presença magnética</span>
                              </div>
                            </div>
                          )}
                          {index % 3 === 1 && (
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <CheckCircle className="w-3 h-3 text-gold flex-shrink-0" />
                                <span className="line-clamp-1">Estruturação perfeita de discursos</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <CheckCircle className="w-3 h-3 text-gold flex-shrink-0" />
                                <span className="line-clamp-1">Conexão emocional profunda com audiência</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <CheckCircle className="w-3 h-3 text-gold flex-shrink-0" />
                                <span className="line-clamp-1">Storytelling que emociona e convence</span>
                              </div>
                            </div>
                          )}
                          {index % 3 === 2 && (
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <CheckCircle className="w-3 h-3 text-gold flex-shrink-0" />
                                <span className="line-clamp-1">Presença de palco impactante</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <CheckCircle className="w-3 h-3 text-gold flex-shrink-0" />
                                <span className="line-clamp-1">Comunicação assertiva e autoritária</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <CheckCircle className="w-3 h-3 text-gold flex-shrink-0" />
                                <span className="line-clamp-1">Técnicas avançadas de liderança</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>;
            })}
          </div>

          {/* Call to Action */}
          <div className="text-center mt-8 sm:mt-12 animate-slide-in-bottom px-3">
            <Button onClick={handleScrollToPurchase} className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 hover:from-yellow-500 hover:via-yellow-600 hover:to-yellow-700 text-black font-black text-base sm:text-lg lg:text-xl px-6 sm:px-8 lg:px-12 py-4 sm:py-5 lg:py-6 rounded-xl sm:rounded-2xl shadow-2xl shadow-yellow-500/50 animate-pulse hover:scale-105 transform transition-all duration-300 w-full sm:w-auto border-2 border-yellow-300">
              <Crown className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 mr-2 sm:mr-3 animate-bounce" />
              🔥 QUERO FALAR SEM MEDO 🔥
              <Zap className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 ml-2 sm:ml-3 animate-bounce" />
            </Button>
            <p className="text-xs sm:text-sm text-muted-foreground mt-3 sm:mt-4">
              ⚡ Acesso instantâneo após o pagamento
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-card/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16">
            <div ref={benefitsHeaderAnimation.ref} className={benefitsHeaderAnimation.className} style={benefitsHeaderAnimation.style}>
              <h2 className="text-3xl sm:text-4xl font-black mb-4 sm:mb-6">
                Por Que Escolher Nossa <span className="text-gold">Biblioteca</span>?
              </h2>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
            {[{
            icon: <TrendingUp className="w-8 h-8 text-gold" />,
            title: "Metodologia Comprovada",
            description: "Técnicas testadas por milhares de oradores de sucesso ao redor do mundo"
          }, {
            icon: <Zap className="w-8 h-8 text-gold" />,
            title: "Resultados Rápidos",
            description: "Veja melhorias significativas em sua comunicação em apenas 7 dias"
          }, {
            icon: <Shield className="w-8 h-8 text-gold" />,
            title: "Garantia Total",
            description: "7 dias de garantia incondicional ou seu dinheiro de volta"
          }].map((benefit, index) => {
            const animation = benefitAnimations[index];
            return <div key={index} ref={animation.ref} className={`text-center p-6 sm:p-8 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover-lift ${animation.className}`} style={animation.style}>
                <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gold/10 rounded-full mb-4 sm:mb-6">
                  {benefit.icon}
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">{benefit.title}</h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{benefit.description}</p>
              </div>;
            })}
          </div>
        </div>
      </section>

      {/* Special Offer */}
      <section id="purchase-section" className="py-12 sm:py-16 md:py-20 lg:py-24 gradient-primary relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="bg-gold text-gold-foreground px-4 sm:px-6 py-2 sm:py-3 text-base sm:text-lg font-bold mb-6 sm:mb-8">
              🚨 OFERTA ESPECIAL - TEMPO LIMITADO
            </Badge>
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 sm:mb-6">
              Pacote Completo por Apenas
            </h2>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 mb-6 sm:mb-8">
              <span className="text-2xl sm:text-3xl text-muted-foreground line-through">R$ 297,00</span>
              <span className="text-5xl sm:text-6xl md:text-7xl font-black text-gold">R$ 17,90</span>
            </div>
            
            <p className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 text-foreground/90 px-4">
              <strong>94% de Desconto!</strong> Uma oportunidade única que não vai durar muito tempo.
            </p>

            {/* Video incorporado na seção */}
            <div className="mb-8 sm:mb-10">
              <div className="relative rounded-xl overflow-hidden shadow-2xl bg-card/10 backdrop-blur-sm border border-gold/20">
                <CustomVideoPlayer
                  src="/video-biblioteca-anuncios.mp4"
                  playOnIntersect={true}
                  showControls={false}
                  playOnceOnly={true}
                  pauseTrigger={pauseVideo}
                />
              </div>
            </div>

            <Button 
              onClick={handleButtonClick} 
              className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 hover:from-yellow-500 hover:via-yellow-600 hover:to-yellow-700 text-black font-black text-lg sm:text-xl md:text-2xl px-10 sm:px-12 md:px-16 py-6 sm:py-8 rounded-2xl shadow-2xl shadow-yellow-500/50 animate-pulse hover:scale-105 transform transition-all duration-300 w-full sm:w-auto border-4 border-yellow-300 hover:border-yellow-400"
            >
              <Crown className="w-6 h-6 sm:w-8 sm:h-8 mr-3 sm:mr-4 animate-bounce text-black" />
              🔥 QUERO O KIT 10 LIVROS 🔥
              <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8 ml-3 sm:ml-4 animate-bounce text-black" />
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-card/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-black mb-4">
                Perguntas <span className="text-gold">Frequentes</span>
              </h2>
              <p className="text-lg text-muted-foreground">
                Tire suas dúvidas sobre a Biblioteca de Oratória
              </p>
            </div>
            
            <Accordion type="single" collapsible className="w-full space-y-4">
              <AccordionItem value="item-1" className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl px-6 py-2">
                <AccordionTrigger className="text-left text-lg font-bold text-gold hover:no-underline">
                  🎯 Como funciona o acesso aos livros?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pt-2">
                  Após a compra, você recebe acesso imediato à biblioteca completa com todos os 10 eBooks em formato PDF, podendo baixar e ler em qualquer dispositivo.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-2" className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl px-6 py-2">
                <AccordionTrigger className="text-left text-lg font-bold text-gold hover:no-underline">
                  ⏰ Quanto tempo tenho para acessar o conteúdo?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pt-2">
                  O acesso é vitalício! Uma vez adquirida, a biblioteca é sua para sempre, sem mensalidades ou renovações.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-3" className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl px-6 py-2">
                <AccordionTrigger className="text-left text-lg font-bold text-gold hover:no-underline">
                  🛡️ E se eu não gostar do conteúdo?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pt-2">
                  Oferecemos 7 dias de garantia incondicional. Se não ficar satisfeito, devolvemos 100% do seu investimento.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-4" className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl px-6 py-2">
                <AccordionTrigger className="text-left text-lg font-bold text-gold hover:no-underline">
                  📱 Posso ler em qualquer dispositivo?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pt-2">
                  Sim! Os livros estão em formato PDF e podem ser lidos em computadores, tablets, smartphones e e-readers.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-5" className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl px-6 py-2">
                <AccordionTrigger className="text-left text-lg font-bold text-gold hover:no-underline">
                  🎓 Para quem é indicado este conteúdo?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pt-2">
                  Para qualquer pessoa que deseja melhorar sua comunicação: profissionais, estudantes, empreendedores, líderes ou qualquer um que queira falar com mais confiança e persuasão.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 sm:py-12 bg-card border-t border-border">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4 sm:mb-6">
              <Mic className="w-6 h-6 sm:w-8 sm:h-8 text-gold mr-2 sm:mr-3" />
              <span className="text-lg sm:text-2xl font-bold">Oratória Amplificada</span>
            </div>
            <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">
              Transformando vidas através do poder da palavra
            </p>
            <div className="flex justify-center space-x-6 text-sm text-muted-foreground">
              <span>© 2024 Todos os direitos reservados</span>
            </div>
          </div>
        </div>
      </footer>
    </div>;
};
export default Index;