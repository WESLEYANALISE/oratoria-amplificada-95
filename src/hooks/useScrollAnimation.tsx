import { useInView } from "react-intersection-observer";

interface UseScrollAnimationProps {
  threshold?: number;
  delay?: number;
  triggerOnce?: boolean;
}

export const useScrollAnimation = ({
  threshold = 0.1,
  delay = 0,
  triggerOnce = true,
}: UseScrollAnimationProps = {}) => {
  const { ref, inView } = useInView({
    threshold,
    triggerOnce,
  });

  return {
    ref,
    inView,
    className: inView 
      ? `animate-scroll-in` 
      : 'opacity-0 translate-y-8',
    style: {
      animationDelay: `${delay}ms`,
    },
  };
};

export default useScrollAnimation;