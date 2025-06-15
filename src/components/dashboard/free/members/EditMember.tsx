import { useParams } from "react-router-dom";
import { useGetMemberQuery } from "../../../../store/api/memberApi";
import LoadingSpinner from "../../../shared/LoadingSpinner";
import MemberForm from "./MemberForm";
import type { GetMembers } from "../../../../types/member";

const EditMember = () => {
    const { memberId } = useParams<{ memberId: string }>();

    const {
        data: memberResponse,
        isLoading,
    } = useGetMemberQuery(memberId || '', {
        skip: !memberId
    });

    if (isLoading) return <LoadingSpinner />;

    const member: GetMembers = memberResponse?.data;

    const defaultValues = {
        fname: member.fname ?? '',
        lname: member.lname ?? '',
        familyBranch: member.familyBranch ?? 'الفرع الثالث',
        familyRelationship: member.familyRelationship ?? 'ابن',
        gender: member.gender ?? 'أنثى',
        birthday: member.birthday ?? null,
        deathDate: member.deathDate ?? null,
        parents: {
            father: member.parents?.father ?? '',
            mother: member.parents?.mother ?? ''
        },
        husband: member.husband ?? '',
        wives: member.wives ?? [],
        children: member.children ?? [],
        image: member.image ?? null,
        summary: member.summary ?? ''
    };

    return (
        <div className="p-4">
            <MemberForm
                defaultValues={defaultValues}
                isEditing={true}
            />
        </div>
    )
}

export default EditMember;