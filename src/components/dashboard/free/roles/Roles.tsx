import { toast } from "react-toastify";
import { useAddUserRoleMutation, useGetAllRolesQuery } from "../../../../store/api/roleApi";
import { useAppSelector } from "../../../../store/store";
import RoleCards from "./RoleCards"
import { useState } from "react";

const Roles = () => {
  const [newRole, setNewRole] = useState("");
  const [addRole, { isLoading }] = useAddUserRoleMutation();
  const user = useAppSelector((state) => state.auth.user)
  const { refetch } = useGetAllRolesQuery();

  const handleAddRole = async () => {
    if (!newRole.trim()) return;

    if (user && user._id) {
      try {
        await addRole({ role: newRole }).unwrap();
        await refetch();
        setNewRole("");
        toast.success("تمت إضافة الدور بنجاح!");
      } catch (error) {
        toast.error("فشل إضافة الدور: ");
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between">
        <h3 className="text-primary text-responsive-lg font-bold px-4 mb-3"> الأدوار و الصلاحيات</h3>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
            placeholder="أدخل الدور الجديد"
            className="flex-1 p-2 border rounded"
          />
          <button
            onClick={handleAddRole}
            disabled={isLoading}
            className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark"
          >
            {isLoading ? "جاري الإضافة..." : "إضافة دور"}
          </button>
        </div>
      </div>
      <RoleCards />
    </div>
  )
}

export default Roles;