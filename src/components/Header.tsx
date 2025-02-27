
import { cn } from "@/lib/utils";
import SlideTransition from "./SlideTransition";

type HeaderProps = {
  className?: string;
};

const Header = ({ className }: HeaderProps) => {
  return (
    <header className={cn("py-8 md:py-12", className)}>
      <SlideTransition direction="down">
        <div className="text-center space-y-4">
          <div className="inline-block">
            <span className="chip bg-secondary text-primary">Simulateur</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
            Investissement Locatif
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base">
            Analysez la rentabilité de votre investissement immobilier en quelques clics.
            Estimez vos revenus, calculez votre rentabilité et visualisez vos flux financiers.
          </p>
        </div>
      </SlideTransition>
    </header>
  );
};

export default Header;
