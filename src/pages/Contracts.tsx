// src/pages/ContractsWithEdit.tsx
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
import { Loader2, PlusIcon, Upload, Download } from "lucide-react";
import { Description, DialogTitle } from "@radix-ui/react-dialog";
import ContractAccordion from "@/components/Skeletons/ContractAccordion";
import { toast } from "react-toastify";
import { errorValidatingWithToast } from "@/utils/ErrorValidation";

const ContractsWithEditPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;
  const {
    data: contracts,
    isLoading,
    error,
    refetch,
  } = useGetContractsQuery({ page: currentPage, limit });
  const { data: allContracts } = useGetAllContractsQuery();

  const contractsFiltered = contracts?.results || [];
  const totalItems = allContracts?.results.length || 0;
  const totalPages = Math.ceil(totalItems / limit);

  const [createContract, { isLoading: isCreating }] =
    useCreateContractMutation();

  // Modals state
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedContract, setSelectedContract] = useState<Contracts | null>(
    null
  );

  // Form data
  const [createFormData, setCreateFormData] = useState({
    number: "",
    valid_until: "",
    file: null as File | null,
  });

  const [editFormData, setEditFormData] = useState({
    number: "",
    valid_until: "",
    file: null as File | null,
  });

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();

    if (createFormData.number) {
      formData.append("number", createFormData.number);
    }
    formData.append("valid_until", createFormData.valid_until);
    if (createFormData.file) {
      formData.append("file", createFormData.file);
    }

    try {
      await createContract(formData).unwrap();
      setCreateModalOpen(false);
      setCreateFormData({ number: "", valid_until: "", file: null });
      toast.success("Договор успешно создан.");
      await refetch();
    } catch (err) {
      console.error("Failed to create contract:", err);
      errorValidatingWithToast(err);
    }
  };

  const handleEdit = (contract: Contracts) => {
    setSelectedContract(contract);
    setEditFormData({
      number: contract.number.toString(),
      valid_until: contract.valid_until,
      file: null,
    });
    setEditModalOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedContract) return;

    try {
      // Simulate API call for editing
      const formData = new FormData();
      formData.append("number", editFormData.number);
      formData.append("valid_until", editFormData.valid_until);
      if (editFormData.file) {
        formData.append("file", editFormData.file);
      }

      // In real app, you would call updateContract API
      // await updateContract({ id: selectedContract.id, data: formData }).unwrap();

      toast.success("Договор успешно обновлен.");
      setEditModalOpen(false);
      await refetch();
    } catch (err) {
      console.error("Failed to update contract:", err);
      errorValidatingWithToast(err);
    }
  };

  const handleDelete = (contract: Contracts) => {
    setSelectedContract(contract);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedContract) return;

    try {
      // Simulate API call for deletion
      // await deleteContract(selectedContract.id).unwrap();

      toast.success("Договор успешно удален.");
      setDeleteModalOpen(false);
      await refetch();
    } catch (err) {
      console.error("Failed to delete contract:", err);
      errorValidatingWithToast(err);
    }
  };

  const handleView = (contract: Contracts) => {
    setSelectedContract(contract);
    setViewModalOpen(true);
  };

  const handleDownloadContract = (contract: Contracts) => {
    if (contract.file_url) {
      // Create download link
      const link = document.createElement("a");
      link.href = contract.file_url;
      link.download = `contract_${contract.number}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Скачивание начато.");
    } else {
      toast.error("Файл договора не найден.");
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
        <main className="flex-1 mt-3 flex">
          <div className="flex-1 px-4">
            <button
              onClick={() => setCreateModalOpen(true)}
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

            <div className="space-y-4 mt-5">
              <div className="bg-white rounded-lg border flex flex-col">
                <div className="flex items-center justify-between border-b p-3 w-full">
                  <div className="flex flex-1 items-center space-x-3">
                    <VueSaxIcon className="w-5 h-5" />
                    <p>Номер договора</p>
                  </div>
                  <p className="flex-1 text-center">Дата заключения</p>
                  <div className="flex-1 text-center">Действия</div>
                </div>

                {isLoading && error ? (
                  <ContractAccordion />
                ) : contractsFiltered.length === 0 ? (
                  <div className="h-44 flex items-center justify-center bg-gray-100">
                    <div className="bg-white h-24 w-1/2 font-medium flex items-center justify-center rounded-lg text-xl">
                      Нет найденных договоров
                    </div>
                  </div>
                ) : (
                  contractsFiltered.map((contract: Contracts) => (
                    <div
                      key={contract.id}
                      className="flex justify-between items-center p-3 border-b last:border-b-0"
                    >
                      <IconLabel
                        color="#DAF1FB"
                        className="flex-1"
                        classIcon="bg-[#DAF1FB]"
                        icon={ContractIcon}
                        label={contract.number.toString()}
                      />
                      <p className="flex-1 text-center text-md text-gray-500">
                        {new Date(contract.valid_until).toLocaleDateString(
                          "ru-RU"
                        )}
                      </p>
                      <div className="flex flex-1 items-center justify-center space-x-3">
                        <button
                          onClick={() => handleView(contract)}
                          className="hover:bg-gray-100 p-1 rounded"
                        >
                          <ShowIcon className="w-6 h-6 cursor-pointer" />
                        </button>
                        <button
                          onClick={() => handleEdit(contract)}
                          className="hover:bg-gray-100 p-1 rounded"
                        >
                          <EditIcon className="w-6 h-6 cursor-pointer" />
                        </button>
                        <button
                          onClick={() => handleDelete(contract)}
                          className="hover:bg-gray-100 p-1 rounded"
                        >
                          <TrashIcon className="w-6 h-6 cursor-pointer" />
                        </button>
                        <button
                          onClick={() => handleDownloadContract(contract)}
                          className="hover:bg-gray-100 p-1 rounded"
                        >
                          <Download className="w-6 h-6 cursor-pointer text-green-600" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
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

            {/* Create Contract Modal */}
            <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
              <DialogContent className="w-[40%]">
                <DialogHeader className="pr-3">
                  <div className="h-2 bg-indigo-600 w-full rounded-md"></div>
                </DialogHeader>
                <Description></Description>
                <form onSubmit={handleCreateSubmit} className="space-y-4">
                  <Input
                    className="h-12"
                    type="number"
                    onChange={(e) =>
                      setCreateFormData({
                        ...createFormData,
                        number: e.target.value,
                      })
                    }
                    placeholder="Номер договора"
                    value={createFormData.number}
                  />
                  <div className="flex space-x-4">
                    <div className="flex flex-1 items-center gap-4 justify-between relative">
                      <p className="flex-1 text-black/50 border h-12 flex items-center px-3 rounded-md text-sm">
                        Файл договора:
                        {createFormData.file && (
                          <span className="text-sm pl-2 text-black">
                            {createFormData.file.name}
                          </span>
                        )}
                      </p>
                      <Input
                        type="file"
                        accept=".txt,.xml,.xlsx,.xls,.doc,.docx,.pdf"
                        className="opacity-0 absolute right-0 w-32 h-14"
                        id="create-file-upload"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setCreateFormData({ ...createFormData, file });
                          }
                        }}
                      />
                      <label
                        htmlFor="create-file-upload"
                        className="cursor-pointer"
                      >
                        <Button
                          type="button"
                          variant="secondary"
                          className="gap-1 bg-indigo-600 hover:bg-indigo-400 text-white text-lg h-12"
                        >
                          <Upload size={16} /> Загрузить
                        </Button>
                      </label>
                    </div>
                    <Input
                      placeholder="Дата заключения"
                      type="date"
                      className="w-36 h-12 flex justify-between"
                      value={createFormData.valid_until}
                      onChange={(e) =>
                        setCreateFormData({
                          ...createFormData,
                          valid_until: e.target.value,
                        })
                      }
                    />
                  </div>
                  <DialogTitle></DialogTitle>
                  <div className="flex justify-end space-x-2 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="h-14 text-lg flex-1 bg-indigo-600 hover:bg-indigo-600 text-white hover:text-white"
                      onClick={() => setCreateModalOpen(false)}
                    >
                      Отменить
                    </Button>
                    <Button
                      type="submit"
                      disabled={
                        !createFormData.number ||
                        !createFormData.valid_until ||
                        !createFormData.file
                      }
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

            {/* Edit Contract Modal */}
            <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
              <DialogContent className="w-[40%]">
                <DialogHeader>
                  <DialogTitle>Редактировать договор</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleEditSubmit} className="space-y-4">
                  <Input
                    className="h-12"
                    type="number"
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        number: e.target.value,
                      })
                    }
                    placeholder="Номер договора"
                    value={editFormData.number}
                  />
                  <div className="flex space-x-4">
                    <div className="flex flex-1 items-center gap-4 justify-between relative">
                      <p className="flex-1 text-black/50 border h-12 flex items-center px-3 rounded-md text-sm">
                        Новый файл:
                        {editFormData.file && (
                          <span className="text-sm pl-2 text-black">
                            {editFormData.file.name}
                          </span>
                        )}
                      </p>
                      <Input
                        type="file"
                        accept=".txt,.xml,.xlsx,.xls,.doc,.docx,.pdf"
                        className="opacity-0 absolute right-0 w-32 h-14"
                        id="edit-file-upload"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setEditFormData({ ...editFormData, file });
                          }
                        }}
                      />
                      <label
                        htmlFor="edit-file-upload"
                        className="cursor-pointer"
                      >
                        <Button
                          type="button"
                          variant="secondary"
                          className="gap-1 bg-indigo-600 hover:bg-indigo-400 text-white text-lg h-12"
                        >
                          <Upload size={16} /> Загрузить
                        </Button>
                      </label>
                    </div>
                    <Input
                      placeholder="Дата заключения"
                      type="date"
                      className="w-36 h-12"
                      value={editFormData.valid_until}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          valid_until: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="flex justify-end space-x-2 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setEditModalOpen(false)}
                    >
                      Отменить
                    </Button>
                    <Button
                      type="submit"
                      className="bg-indigo-600 hover:bg-indigo-700 text-white"
                    >
                      Сохранить
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>

            {/* View Contract Modal */}
            <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
              <DialogContent className="w-[50%]">
                <DialogHeader>
                  <DialogTitle>Просмотр договора</DialogTitle>
                </DialogHeader>
                {selectedContract && (
                  <div className="space-y-4">
                    <div>
                      <strong>Номер договора:</strong> {selectedContract.number}
                    </div>
                    <div>
                      <strong>Дата заключения:</strong>{" "}
                      {new Date(
                        selectedContract.valid_until
                      ).toLocaleDateString("ru-RU")}
                    </div>
                    <div>
                      <strong>Дата создания:</strong>{" "}
                      {new Date(selectedContract.created_at).toLocaleDateString(
                        "ru-RU"
                      )}
                    </div>
                    <div>
                      <strong>Автор:</strong> {selectedContract.author}
                    </div>
                    {selectedContract.file_url && (
                      <div className="flex items-center gap-2">
                        <strong>Файл:</strong>
                        <Button
                          onClick={() =>
                            handleDownloadContract(selectedContract)
                          }
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Скачать файл
                        </Button>
                      </div>
                    )}
                  </div>
                )}
                <div className="flex justify-end">
                  <Button onClick={() => setViewModalOpen(false)}>
                    Закрыть
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* Delete Confirmation Modal */}
            <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
              <DialogContent className="w-[30%]">
                <DialogHeader>
                  <DialogTitle className="flex items-center space-x-2">
                    <TrashIcon className="h-6 w-6 text-red-500" />
                    <span>Подтверждение удаления</span>
                  </DialogTitle>
                </DialogHeader>
                <div className="py-4">
                  <p className="text-gray-600">
                    Вы уверены, что хотите удалить договор №{" "}
                    <span className="font-semibold">
                      {selectedContract?.number}
                    </span>
                    ?
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Это действие нельзя отменить.
                  </p>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setDeleteModalOpen(false)}
                  >
                    Отменить
                  </Button>
                  <Button
                    onClick={handleDeleteConfirm}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    Удалить
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </main>
      </>
    </Layout>
  );
};

export default ContractsWithEditPage;
