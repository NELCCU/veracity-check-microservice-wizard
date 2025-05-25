
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface CollapsibleSectionProps {
  title: string;
  icon: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

export const CollapsibleSection = ({
  title,
  icon,
  isOpen,
  onToggle,
  children
}: CollapsibleSectionProps) => {
  return (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <CollapsibleTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          <span className="flex items-center gap-2">
            {icon}
            {title}
          </span>
          <span className="text-sm text-gray-500">
            {isOpen ? 'Contraer' : 'Expandir'}
          </span>
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-4">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
};
