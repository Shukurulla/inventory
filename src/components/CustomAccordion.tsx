import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { ReactNode } from "react";

interface CustomAccordionProps {
  value: string;
  triggerContent: ReactNode;
  onClick?: () => void;
  children?: ReactNode;
  className?: string;
}

const CustomAccordion = ({
  value,
  triggerContent,
  onClick,
  children,
  className,
}: CustomAccordionProps) => {
  return (
    <Accordion type="single" collapsible className={className ? className: 'border-t ml-3 bg-white'}>
      <AccordionItem value={value}>
        <AccordionTrigger className="flex items-center px-4 hover:no-underline cursor-pointer" onClick={onClick}>
          {triggerContent}
        </AccordionTrigger>
        <AccordionContent className="bg-indigo-50 dark:bg-zinc-950 p-0">
          {children}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default CustomAccordion;
