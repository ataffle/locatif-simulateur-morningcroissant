
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type SlideTransitionProps = {
  children: ReactNode;
  className?: string;
  direction?: "up" | "down";
  delay?: number;
  duration?: number;
};

const SlideTransition = ({
  children,
  className,
  direction = "up",
  delay = 0,
  duration = 400,
}: SlideTransitionProps) => {
  const baseAnimation = direction === "up" ? "animate-slide-up" : "animate-slide-down";
  
  const style = {
    animationDelay: `${delay}ms`,
    animationDuration: `${duration}ms`,
  };

  return (
    <div 
      className={cn(baseAnimation, className)} 
      style={style}
    >
      {children}
    </div>
  );
};

export default SlideTransition;
