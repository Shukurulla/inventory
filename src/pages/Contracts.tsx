import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  useCreateContractMutation,
  useGetAllContractsQuery,
  useGetContractsQuery,
  type Contracts,
} from "@/api/contactsApi";
import Layout from "@/components/layout";
import VueSaxIcon from "@/assets/Icons/vueSaxIcon";
import ContractIcon from "@/assets/Icons/ContractIcon";
import ShowIcon from "@/assets/Icons/showIcon";
import TrashIcon from "@/assets/Icons/TrashIcon";
import EditIcon from "@/assets/Icons/EditIcon";
import IconLabel from "@/components/ReusableIcon";
import { Loader2, PlusIcon, Upload } from "lucide-react";
import { Description, DialogTitle } from "@radix-ui/react-dialog";
import ContractAccordion from "@/components/Skeletons/ContractAccordion";
import { toast } from "react-toastify";
import { errorValidatingWithToast } from "@/utils/ErrorValidation";

const ContractsPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;
  const { data: contracts, isLoading, error, refetch } = useGetContractsQuery({ page: currentPage, limit });
  const { data: allContracts } = useGetAllContractsQuery();
  
  
    const contractsFiltered = contracts?.results || [];
    const totalItems = allContracts?.results.length || 0;
    const totalPages = Math.ceil(totalItems / limit);
    

  const [createContract, { isLoading: isCreating }] = useCreateContractMutation();
  const [open, setOpen] = useState(false);
  const [number, setNumber] = useState<number>();
  const [valid_until, setValid_until] = useState("");
  const [file, setFile] = useState<{ file?: File }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    if (number !== undefined) {
      formData.append("number", number.toString());
    }
    formData.append("valid_until", valid_until);
    if (file.file) {
      formData.append("file", file.file);
    }
    console.log(file);
    

    try {
      await createContract(formData).unwrap();
      setOpen(false);
      setNumber(0);
      setValid_until("");
      setFile({})
        toast.success('Договор успешно сохранён.')
        await refetch()
    } catch (err) {
      console.error("Failed to create contract:", err);
      errorValidatingWithToast(err)
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <Layout>
      <>
        <header className="p-6">
          <h1 className="text-3xl font-semibold">Договоры</h1>
        </header>
        <main className="flex-1 flex">
          <div className="flex-1 px-4">
            <button
              onClick={() => setOpen(true)}
              className="h-20 mb-4 rounded-lg border-dashed border-2 border-indigo-200 bg-indigo-50 hover:bg-indigo-100 w-full flex items-center justify-center text-indigo-500 text-xl"
            >
              <PlusIcon className="w-6 h-6" /> Добавить новый договор
            </button>
            <div className="w-full">
              <h2 className="text-lg font-semibold text-indigo-500 border-b-2 border-gray-200 cursor-pointer select-none">
                <span className="relative h-full">
                  Список
                  <span className="absolute w-full h-[2px] -bottom-[6px] left-0 bg-indigo-600"></span>
                </span>
              </h2>
            </div>
            {/* Dialog */}
            <div className="flex justify-between items-center mt-5">
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="w-[40%]">
                  <DialogHeader className="pr-3">
                    <div className="h-2 bg-indigo-600 w-full rounded-md"></div>
                  </DialogHeader>
                  <Description></Description>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                      id="name"
                      className="h-12"
                      type="number"
                      onChange={(e) => setNumber(+e.target.value)}
                      placeholder="Название договора"
                    />
                    <div className="flex space-x-4">
                      <div className="flex flex-1 items-center gap-4 justify-between relative">
                        <p className="flex-1 text-black/50 border h-12 flex items-center px-3 rounded-md text-sm">
                          Файл договора:
                          {file && file.file && (
                            <span className="text-sm pl-2 text-black">
                              {file.file.name}
                            </span>
                          )}
                        </p>
                        <Input
                          type="file"
                          accept=".txt,.xml,.xlsx,.xls,.doc,.docx"
                          className="opacity-0 absolute right-0 w-32 h-14"
                          id="file-upload"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setFile({ file });
                            }
                          }}
                        />
                        <label htmlFor="file-upload" className="cursor-pointer">
                          <Button
                            variant="secondary"
                            className="gap-1 bg-indigo-600 hover:bg-indigo-400 text-white text-lg h-12"
                          >
                            <Upload size={16} /> Загрузить
                          </Button>
                        </label>
                      </div>
                      <Input
                        id="date"
                        placeholder="Дата заключения"
                        type="date"
                        className="w-36 h-12 flex justify-between"
                        value={valid_until}
                        onChange={(e) => setValid_until(e.target.value)}
                      />
                    </div>
                    <DialogTitle></DialogTitle>
                    <div className="flex justify-end space-x-2 pt-2">
                      <Button
                        variant="outline"
                        className="h-14 text-lg flex-1 bg-indigo-600 hover:bg-indigo-600 text-white hover:text-white"
                        onClick={() => setOpen(false)}
                      >
                        Отменить
                      </Button>
                      <Button type="submit"
                        disabled={number == null || valid_until == '' || valid_until == null || !valid_until || !file.file}
                        className="h-14 text-lg flex-1 bg-indigo-600 hover:bg-indigo-600 text-white flex items-center justify-center"
                      >
                        {isCreating ? (
                          <Loader2 className="animate-spin mr-2" size={20} />
                        ) : (
                          "Создать"
                        )}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-4">
              <div
                className="bg-white rounded-lg border flex flex-col"
              >
                <div className="flex items-center justify-between border-b p-3 w-full">
                  <div className="flex flex-1 items-center space-x-3">
                    <VueSaxIcon className="w-5 h-5" />
                    <p>Номер договора</p>
                  </div>
                  <p className="flex-1 text-center">Дата заключении</p>
                  <div className="flex-1"></div>
                </div>
                {isLoading && error 
                  ? <ContractAccordion/> 
                  : contractsFiltered.map((contract: Contracts) => (
                  <div className="flex justify-between items-center p-3 border-b last:border-b-0">
                    <IconLabel
                      color="#DAF1FB"
                      className="flex-1"
                      classIcon="bg-[#DAF1FB]"
                      icon={ContractIcon}
                      label={contract.number+""}
                    />
                    <p className="flex-1 text-center text-md text-gray-500">
                        {new Date(contract.valid_until).toLocaleDateString('ru-RU')}
                    </p>
                    <div className="flex flex-1 items-center justify-end space-x-3">
                      <ShowIcon className="w-6 h-6 cursor-pointer" />
                      <TrashIcon className="w-6 h-6 cursor-pointer" />
                      <EditIcon className="w-6 h-6 cursor-pointer" />
                    </div>
                  </div>
                ))}
                {error && <div className="h-44 flex items-center justify-center bg-gray-100">
                    <div className="bg-white h-24 w-1/2 font-medium flex items-center justify-center rounded-lg text-xl">Нет найденных договоров</div>
                  </div>}
              </div>
            </div>
            {totalPages > 1 && (
              <div className="flex justify-between items-center mt-5">
                <Button
                  onClick={handlePrevious}
                  disabled={currentPage === 1}
                  className="h-10 text-sm bg-indigo-600 hover:bg-indigo-500 text-white"
                >
                  Предыдущий
                </Button>
                <p className="text-sm text-gray-600">
                  Страница {currentPage} из {totalPages}
                </p>
                <Button
                  onClick={handleNext}
                  disabled={currentPage === totalPages}
                  className="h-10 text-sm bg-indigo-600 hover:bg-indigo-500 text-white"
                >
                  Следующий
                </Button>
              </div>
            )}
          </div>
        </main>
      </>
    </Layout>
  );
};

export default ContractsPage;