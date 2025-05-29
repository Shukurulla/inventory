import CustomAccordion from "../CustomAccordion";
import { Skeleton } from "../ui/skeleton";

export default function AccordionSkeleton() {
  return (
    <div className="flex flex-col">
      <CustomAccordion
        value=""
        className="p-0 bg-card border-b"
        triggerContent={
          <div className="flex items-center space-x-5">
            <Skeleton className="w-10 h-10 rounded-full bg-accent"></Skeleton>
            <Skeleton className="w-36 h-8 bg-accent"></Skeleton>
          </div>
        }
      >
        <div></div>
      </CustomAccordion>
    </div>
  );
}
