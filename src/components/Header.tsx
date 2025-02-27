
import { cn } from "@/lib/utils";
import SlideTransition from "./SlideTransition";

type HeaderProps = {
  className?: string;
};

const Header = ({ className }: HeaderProps) => {
  return (
    <header className={cn("", className)}>
      {/* Logo and nav bar */}
      <div className="border-b border-gray-100 py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center">
            <a href="https://www.morningcroissant.fr" target="_blank" rel="noopener noreferrer">
              <MorningCroissantLogo />
            </a>
          </div>
          <a 
            href="https://www.morningcroissant.fr/publiez-votre-logement" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full px-6 py-2.5 text-base font-semibold text-primary bg-white border-[3px] border-primary hover:bg-primary/5 transition-colors"
          >
            Vous êtes propriétaire ?
          </a>
        </div>
      </div>
      
      {/* Titre du simulateur */}
      <div className="py-8 md:py-12 bg-gradient-to-r from-primary-morningblue/5 to-secondary-morningorange/5">
        <SlideTransition direction="down">
          <div className="text-center space-y-4">
            <div className="inline-block">
              <span className="chip bg-primary text-primary-foreground">Simulateur</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-gray-900">
              Investissement Locatif
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base">
              Analysez la rentabilité de votre investissement immobilier en quelques clics.
              Estimez vos revenus, calculez votre rentabilité et visualisez vos flux financiers.
            </p>
          </div>
        </SlideTransition>
      </div>
    </header>
  );
};

const MorningCroissantLogo = () => {
  return (
    <div className="text-3xl font-bold flex items-center">
      <span className="text-primary-morningblue">morning</span>
      <span className="text-secondary-morningorange">croissant</span>
    </div>
  );
};

export default Header;
