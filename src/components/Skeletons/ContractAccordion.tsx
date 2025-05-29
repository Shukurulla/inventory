import { Skeleton } from "../ui/skeleton";

export default function ContractAccordion() {
  return (
    <Skeleton className="h-14 flex items-center justify-between px-5 bg-gray-100">
      <div className="flex-1">
        <Skeleton className="h-8 rounded-lg w-44 bg-white" />
      </div>
      <Skeleton className="h-8 rounded-lg flex-1 bg-white" />
      <div className="flex flex-1 items-center justify-end gap-x-2">
        <Skeleton className="w-10 h-10 rounded-full bg-white" />
        <Skeleton className="w-10 h-10 rounded-full bg-white" />
        <Skeleton className="w-10 h-10 rounded-full bg-white" />
      </div>
    </Skeleton>
  );
}
