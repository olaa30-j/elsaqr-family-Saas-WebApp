import { useParams } from "react-router-dom";
import { useGetUserQuery } from "../../../../store/api/usersApi";
import LoadingSpinner from "../../../shared/LoadingSpinner";
import UserForm from "./UserForm";
import PermissionsSection from "../admin/UserPermissionsForm";

const EditUsers = () => {
    const { userId } = useParams<{ userId: string }>();

    const { data: userResponse, isLoading, isError } = useGetUserQuery(userId || '', {
        skip: !userId
    });

    if (isLoading) return <LoadingSpinner />;
    if (isError) return (<p>خطأ مستخدم</p>);
    if (!userResponse) return (<p>لا يوجد مستخدم</p>);

    const user = userResponse.data || userResponse;

    return (
        <div>
            <UserForm
                defaultValues={{
                    email: user.email || '',
                    phone: user.phone || '',
                    familyBranch: user.familyBranch || 'الفرع الثالث',
                    familyRelationship: user.familyRelationship || 'ابن',
                    address: user.address || '',
                    status: user.status || 'قيد الانتظار',
                    role: user.role || ['مستخدم'],
                }}
                isEditing={true}
            />
            <div>
                <PermissionsSection user={user} />
            </div>

        </div>
    );
};

export default EditUsers;