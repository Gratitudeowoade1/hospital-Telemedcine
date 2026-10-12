import { Menu, X } from 'lucide-react'

const MenuToggle = ({ isOpen, onToggle }) => (
  <button
    onClick={onToggle}
    className="fixed top-4 left-4 z-50 p-2 rounded bg-white shadow-md hover:bg-gray-100"
  >
    {isOpen ? <X size={20} /> : <Menu size={20} />}
  </button>
)

export default MenuToggle
