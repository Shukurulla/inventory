import type { SetInnType } from "@/types";
import { Input } from "./ui/input";
import { Skeleton } from "./ui/skeleton";
import { Button } from "./ui/button";
import { Download } from "lucide-react";

const AddInnForm = ({
  formDataThird,
  setFormDataThird,
  isLoading,
}: {
  formDataThird: SetInnType[];
  setFormDataThird: React.Dispatch<React.SetStateAction<SetInnType[]>>;
  isLoading: boolean;
}) => {
  console.log(formDataThird);

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex flex-col">
        {isLoading && (
          <div className="flex flex-col space-y-2">
            <div className="w-full flex items-center gap-2">
              <Skeleton className="flex-1 h-12 bg-gray-200 dark:bg-card" />
              <Skeleton className="flex-1 h-12 bg-gray-200 dark:bg-card" />
            </div>
            <div className="w-full flex items-center gap-2">
              <Skeleton className="flex-1 h-12 bg-gray-200 dark:bg-card" />
              <Skeleton className="flex-1 h-12 bg-gray-200 dark:bg-card" />
            </div>
          </div>
        )}
        {!isLoading &&
          formDataThird.map((item, index) => (
            <div>
              <div key={index} className="flex items-center gap-2 mb-2 h-12">
                <p className="text-xl w-1/2 border h-full flex items-center justify-center rounded-lg text-accent-foreground">
                  {item.name}
                </p>
                <Input
                  placeholder="ИНН"
                  className="w-1/2 h-full text-accent-foreground"
                  value={item.inn}
                  onChange={(e) => {
                    const newFormData = [...formDataThird];
                    newFormData[index].inn = e.target.value;
                    setFormDataThird(newFormData);
                  }}
                />
              </div>
              <div className="flex flex-1 items-center  gap-2">
                <p className="text-lg font-medium text-accent-foreground">
                  QR-код
                </p>
                <Button variant="secondary" className="gap-1">
                  <Download size={16} /> Скачать
                </Button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default AddInnForm;
