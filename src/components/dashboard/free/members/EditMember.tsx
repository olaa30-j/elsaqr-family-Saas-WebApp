import { useParams } from "react-router-dom";
import { useGetMemberQuery } from "../../../../store/api/memberApi";
import LoadingSpinner from "../../../shared/LoadingSpinner";
import MemberForm from "./MemberForm";
import type { GetMembers } from "../../../../types/member";
import { useGetUsersQuery, useSwapMemberMutation } from '../../../../store/api/usersApi';
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const EditMember = () => {
    const { memberId } = useParams<{ memberId: string }>();
    const [selectedUserId, setSelectedUserId] = useState<string>('');

    const { data: usersData } = useGetUsersQuery({ page: 1, limit: 1000 });
    const [swapMember] = useSwapMemberMutation();

    const {
        data: memberResponse,
        isLoading,
    } = useGetMemberQuery(memberId || '', {
        skip: !memberId
    });
    
    useEffect(() => {
        if (memberResponse?.data?.userId) {
            setSelectedUserId(memberResponse.data.userId._id);
        }
    }, [memberResponse]);

    const handleUserSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedUserId(e.target.value);
    };

    const handleSubmitUser = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (memberId) {
                await swapMember({
                    userId: selectedUserId,
                    newMemberId: memberId
                }).unwrap();

                toast.success('تم ربط الحساب بالعضو بنجاح');
            }
        } catch (error: any) {
            toast.error(error.data?.message || 'حدث خطأ أثناء ربط الحساب');
        }
    };

    if (isLoading) return <LoadingSpinner />;

    const member: GetMembers = memberResponse?.data;

    const defaultValues = {
        fname: member.fname ?? '',
        lname: member.lname ?? '',
        familyBranch: member.familyBranch._id ?? '',
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

            <div className="mt-10">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-medium mb-4">ربط عضو بالمستخدم</h3>

                    <form onSubmit={handleSubmitUser} className="space-y-4">
                        {/* User Selection */}
                        <div className="space-y-1">
                            <label htmlFor="user-select" className="block text-sm font-medium text-gray-700">
                                الحساب <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={selectedUserId}
                                onChange={handleUserSelect}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                            >
                                <option value="">اختر الحساب</option>
                                {usersData?.data.map(user => (
                                    <option
                                        key={user._id}
                                        value={user._id}
                                        style={user._id === selectedUserId ? { backgroundColor: '#ebf5ff' } : {}}
                                    >
                                        {user.email}
                                        {user._id === selectedUserId && " (مرتبط حالياً)"}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className='flex justify-end'>
                            <button
                                type="submit"
                                className="inline-flex py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                ربط الحساب
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default EditMember;