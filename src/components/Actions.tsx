import { Edit2, Trash2 } from "lucide-react";

type ActionProps = {
  setOpenEditModal: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenDropDown: React.Dispatch<React.SetStateAction<boolean>>;
};

const Actions: React.FC<ActionProps> = ({
  setOpenEditModal,
  setOpenDeleteModal,
  setOpenDropDown,
}) => {
  return (
    <div
      className="absolute right-2 top-12 z-50 w-36 bg-[rgb(24,27,32)] border border-[rgb(84,90,106)] rounded-xl shadow-lg overflow-hidden"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        className="flex items-center gap-3 w-full px-4 py-2 text-sm text-white hover:bg-gray-700 transition"
        onClick={() => {
          setOpenEditModal(true);
          setOpenDropDown(false);
        }}
      >
        <Edit2 className="w-4 h-4" />
        Edit
      </button>

      <button
        className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-400 hover:bg-red-500/20 transition"
        onClick={() => {
          setOpenDeleteModal(true);
          setOpenDropDown(false);
        }}
      >
        <Trash2 className="w-4 h-4" />
        Delete
      </button>
    </div>
  );
};

export default Actions;