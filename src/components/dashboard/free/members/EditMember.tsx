import { useParams } from "react-router-dom";
import { useGetMemberQuery } from "../../../../store/api/memberApi";
import LoadingSpinner from "../../../shared/LoadingSpinner";
import MemberForm from "./MemberForm";

const EditMember = () => {
    const { memberId } = useParams<{ memberId: string }>();

    const { data: memberResponse, isLoading, isError } = useGetMemberQuery(memberId || '', {
        skip: !memberId
    });

    if (isLoading) return <LoadingSpinner />;
    if (isError) return (<p>خطأ مستخدم</p>);
    if (!memberResponse) return (<p>لا يوجد مستخدم</p>);

    const member = memberResponse!.data || memberResponse;
    console.log(member);
    
    return (
        <div>
            <MemberForm
                defaultValues={{
                    fname: member.fname || '',
                    lname: member.lname || '',
                    familyBranch: member.familyBranch || 'الفرع الثالث',
                    familyRelationship: member.familyRelationship || 'ابن',
                    gender: member.gender || 'أنثى',
                    // father: member.father || '',
                    // husband: member.husband || '',
                    // wives: member.wives || [],
                    // image: member.image || ''
                }}
                isEditing={true}
            />
        </div>
    )
}

export default EditMember