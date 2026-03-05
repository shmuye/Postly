type EditModalProps = {
    id: number, 
    setOpenEditModal: React.Dispatch<React.SetStateAction<boolean>>;
    setOpenDropDown: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditModal: React.FC<EditModalProps> = ({
    id,
    setOpenEditModal,
    setOpenDropDown
}) => {
  return (
    <div>
        <form action="">
            <div>
            <button
               onClick={() => {
                setOpenEditModal(false);
                setOpenDropDown(false)
               }}
            >
                Cancel
            </button>
            <button
                type="submit"
                onClick={() => {
                    setOpenEditModal(false);
                    setOpenDropDown(false)
                }}
            >
                Save 
            </button>
            </div>
           
        </form>
    </div>
  )
}

export default EditModal