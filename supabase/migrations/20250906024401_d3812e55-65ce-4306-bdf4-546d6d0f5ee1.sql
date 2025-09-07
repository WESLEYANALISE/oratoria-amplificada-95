-- Criar tabela para os eBooks de oratória
CREATE TABLE public.vender_oratoria (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  livro TEXT NOT NULL,
  resumo TEXT NOT NULL,
  capa TEXT NOT NULL,
  ordem INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.vender_oratoria ENABLE ROW LEVEL SECURITY;

-- Criar política para permitir leitura pública
CREATE POLICY "Livros são visíveis publicamente" 
ON public.vender_oratoria 
FOR SELECT 
USING (true);

-- Inserir os 10 eBooks
INSERT INTO public.vender_oratoria (livro, resumo, ordem, capa) VALUES
('O Poder da Palavra', 'Descubra como transformar palavras em ferramentas de persuasão. Aprenda técnicas avançadas para convencer, influenciar e liderar através da comunicação assertiva.', 1, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop'),
('Conquistando o Palco', 'Domine seus medos e se torne um orador magnético. Técnicas profissionais para controlar nervosismo, projetar confiança e cativar qualquer audiência.', 2, 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=400&h=600&fit=crop'),
('A Arte da Persuasão', 'Estratégias psicológicas comprovadas para influenciar mentes e corações. Aprenda a construir argumentos irresistíveis e a vender suas ideias com maestria.', 3, 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=400&h=600&fit=crop'),
('Liderança Vocal', 'Desenvolva uma voz que transmite autoridade e carisma. Técnicas de respiração, dicção e projeção vocal para líderes que querem impressionar.', 4, 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=600&fit=crop'),
('Debates Vencedores', 'Torne-se imbatível em discussões e debates. Estratégias táticas para contra-argumentar, desarmar oponentes e sempre sair por cima.', 5, 'https://images.unsplash.com/photo-1560472355-536de3962603?w=400&h=600&fit=crop'),
('Carisma Magnético', 'Desenvolva uma presença irresistível que atrai e encanta. Segredos para construir conexões instantâneas e se tornar memorável em qualquer encontro.', 6, 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&h=600&fit=crop'),
('Storytelling Poderoso', 'Aprenda a contar histórias que emocionam e transformam. Técnicas narrativas para criar impacto, gerar empatia e tornar suas mensagens inesquecíveis.', 7, 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop'),
('Apresentações Impactantes', 'Crie apresentações que prendem a atenção do início ao fim. Estruturas testadas, recursos visuais e técnicas de engajamento para resultados extraordinários.', 8, 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=600&fit=crop'),
('Oratória Executiva', 'Comunique-se como um CEO de sucesso. Técnicas exclusivas para reuniões de alta performance, negociações estratégicas e discursos corporativos.', 9, 'https://images.unsplash.com/photo-1556157382-97eda2d62296?w=400&h=600&fit=crop'),
('Mestria Completa', 'A síntese de todas as técnicas de oratória em um guia definitivo. Para quem busca a excelência absoluta na arte de falar e impressionar multidões.', 10, 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=600&fit=crop');

-- Criar função para atualizar timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Criar trigger para atualização automática de timestamps
CREATE TRIGGER update_vender_oratoria_updated_at
BEFORE UPDATE ON public.vender_oratoria
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();