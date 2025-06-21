import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../../../ui/Modal";
import type { GetMembers } from "../../../../types/member";
import { toast } from "react-toastify";
import { useDeleteMemberMutation } from "../../../../store/api/memberApi";
import { genderOptions } from "../../../../types/member";
import MemberForm from "./MemberForm";
import { CheckIcon, XIcon, ChevronDownIcon, ChevronUpIcon, ShieldQuestion } from "lucide-react";
import { useFamilyBranches } from "../../../../hooks/useFamilyBranches";
import FamilyTreeGuide from "./FamilyTreeGuide";

/**
 * جدول أعضاء العائلة مع إمكانيات الفرز، التصفية، والإدارة
 * 
 * @component
 * @example
 * // مثال استخدام أساسي
 * <MembersTable
 *   currentPage={1}
 *   membersData={members}
 *   pagination={{
 *     totalMembers: 50,
 *     totalPages: 5,
 *     currentPage: 1,
 *     pageSize: 10
 *   }}
 *   onPageChange={(page) => console.log('الصفحة المحددة:', page)}
 *   onBranchChange={(branch) => console.log('الفرع المحدد:', branch)}
 *   isLoading={false}
 *   selectedBranch=""
 *   refetchMembers={() => console.log('إعادة جلب البيانات')}
 * />
 * 
 * @param {Object} props - خصائص المكون
 * @param {number} props.currentPage - رقم الصفحة الحالية
 * @param {GetMembers[]} props.membersData - مصفوفة تحتوي على بيانات الأعضاء
 * @param {Object} [props.pagination] - معلومات التقسيم الصفحي
 * @param {number} props.pagination.totalMembers - العدد الكلي للأعضاء
 * @param {number} props.pagination.totalPages - العدد الكلي للصفحات
 * @param {number} props.pagination.currentPage - الصفحة الحالية
 * @param {number} props.pagination.pageSize - عدد العناصر في الصفحة الواحدة
 * @param {function} props.onPageChange - دالة تُستدعى عند تغيير الصفحة
 * @param {function} props.onBranchChange - دالة تُستدعى عند تغيير الفرع العائلي
 * @param {boolean} props.isLoading - حالة التحميل
 * @param {string} props.selectedBranch - الفرع العائلي المحدد
 * @param {function} [props.refetchMembers] - دالة لإعادة جلب بيانات الأعضاء
 *  */

interface MembersTableProps {
    currentPage: number;
    itemsPerPage?: number;
    membersData: GetMembers[];
    pagination?: {
        totalMembers: number;
        totalPages: number;
        currentPage: number;
        pageSize: number;
    };
    onPageChange: (page: number) => void;
    onBranchChange: (branch: string) => void;
    isLoading: boolean;
    selectedBranch: string;
    refetchMembers?: () => void;
}

const MembersTable: React.FC<MembersTableProps> = ({
    currentPage,
    membersData,
    pagination,
    onPageChange,
    onBranchChange,
    isLoading,
    selectedBranch,
    refetchMembers
}) => {
    const navigate = useNavigate();
    const [sortConfig, setSortConfig] = useState<{ key: keyof GetMembers | 'parents'; direction: 'asc' | 'desc' } | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [memberToDelete, setMemberToDelete] = useState<GetMembers | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [deleteMember, { isLoading: isDeleting }] = useDeleteMemberMutation();
    const [openGuide, setOpenGuide] = useState(false)

    const [fatherFilter, setFatherFilter] = useState("");
    const [motherFilter, setMotherFilter] = useState("");
    const [hasAccountFilter, setHasAccountFilter] = useState<boolean | null>(null);
    const [genderFilter, setGenderFilter] = useState("");

    const { familyBranches } = useFamilyBranches();

    const handleSort = (key: keyof GetMembers | 'parents') => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig?.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const allFathers = useMemo(() => {
        const fathers = new Set<string>();
        membersData.forEach((member: GetMembers) => {
            if (member.parents && typeof member.parents.father !== 'string' && member.parents.father?.fname && member.parents.father?.lname) {
                fathers.add(`${member.parents.father.fname} ${member.parents.father.lname}`);
            }
        });
        return Array.from(fathers).sort((a, b) => a.localeCompare(b, 'ar'));
    }, [membersData]);

    const allMothers = useMemo(() => {
        const mothers = new Set<string>();
        membersData.forEach((member: GetMembers) => {
            if (member.parents && typeof member.parents.mother !== 'string' && member.parents.mother?.fname && member.parents.mother?.lname) {
                mothers.add(`${member.parents.mother.fname} ${member.parents.mother.lname}`);
            }
        });
        return Array.from(mothers).sort((a, b) => a.localeCompare(b, 'ar'));
    }, [membersData]);

    const filteredMembers = useMemo(() => {
        return membersData.filter(member => {
            const fullName = `${member.fname} ${member.lname}`.toLowerCase();
            const nameMatch = searchTerm === "" || fullName.includes(searchTerm.toLowerCase());

            const branchMatch = selectedBranch === "" || member.familyBranch._id === selectedBranch;

            const fatherMatch = fatherFilter === "" ||
                (member.parents?.father &&
                    (typeof member.parents.father === 'string' ?
                        member.parents.father.includes(fatherFilter) :
                        member.parents.father.fname.includes(fatherFilter)));

            const motherMatch = motherFilter === "" ||
                (member.parents?.mother &&
                    (typeof member.parents.mother === 'string' ?
                        member.parents.mother.includes(motherFilter) :
                        member.parents.mother.fname.includes(motherFilter)));

            const accountMatch = hasAccountFilter === null || member.isUser === hasAccountFilter;

            const genderMatch = genderFilter === "" || member.gender === genderFilter;

            return nameMatch && branchMatch && fatherMatch && motherMatch && accountMatch && genderMatch;
        });
    }, [membersData, searchTerm, selectedBranch, fatherFilter, motherFilter, hasAccountFilter, genderFilter]);

    const sortedMembers = useMemo(() => {
        return [...filteredMembers].sort((a, b) => {
            if (!sortConfig) return 0;

            // Handle parent sorting
            if (sortConfig.key === 'parents') {
                const aFather = (a.parents?.father && typeof a.parents.father !== 'string') ? a.parents.father.fname : '';
                const bFather = (b.parents?.father && typeof b.parents.father !== 'string') ? b.parents.father.fname : '';
                const aMother = (a.parents?.mother && typeof a.parents.mother !== 'string') ? a.parents.mother.fname : '';
                const bMother = (b.parents?.mother && typeof b.parents.mother !== 'string') ? b.parents.mother.fname : '';

                if (sortConfig.direction === 'asc') {
                    return aFather.localeCompare(bFather, 'ar') || aMother.localeCompare(bMother, 'ar');
                } else {
                    return bFather.localeCompare(aFather, 'ar') || bMother.localeCompare(aMother, 'ar');
                }
            }

            const aValue = a[sortConfig.key as keyof GetMembers];
            const bValue = b[sortConfig.key as keyof GetMembers];

            if (typeof aValue === 'string' && typeof bValue === 'string') {
                return sortConfig.direction === 'asc'
                    ? aValue.localeCompare(bValue, 'ar')
                    : bValue.localeCompare(aValue, 'ar');
            }
            return 0;
        });
    }, [filteredMembers, sortConfig]);

    const handleEdit = (memberId: string) => {
        navigate(`/admin/members/${memberId}`);
    };

    const handleDeleteClick = (member: GetMembers) => {
        setMemberToDelete(member);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!memberToDelete?._id) return;

        try {
            await deleteMember(memberToDelete._id).unwrap();
            toast.success("تم حذف العضو بنجاح");
            refetchMembers?.();
            setIsDeleteModalOpen(false);
            setMemberToDelete(null);
        } catch (error) {
            toast.error("فشل في حذف العضو");
        }
    };

    const handlePageChange = (page: number) => {
        onPageChange(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleBranchFilter = (branch: any | "") => {
        onBranchChange(branch);
    };

    const clearFilters = () => {
        onBranchChange("");
        setSearchTerm("");
        setFatherFilter("");
        setMotherFilter("");
        setHasAccountFilter(null);
        setGenderFilter("");
    };

    const getSortIcon = (key: keyof GetMembers | 'parents') => {
        if (!sortConfig || sortConfig.key !== key) {
            return <ChevronDownIcon className="w-4 h-4 opacity-50" />;
        }
        return sortConfig.direction === 'asc'
            ? <ChevronUpIcon className="w-4 h-4" />
            : <ChevronDownIcon className="w-4 h-4" />;
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="relative flex flex-col w-full h-full text-primary bg-white rounded-xl shadow-sm">
            <div className="p-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="text-2xl font-bold text-primary">إدارة أعضاء العائلة</h3>
                        <p className="text-slate-500 mt-1">قائمة بجميع أعضاء العائلة المسجلين في النظام</p>
                    </div>

                    <button onClick={() => setOpenGuide(!openGuide)}>
                        <ShieldQuestion className="w-5 h-5" />
                    </button>
                </div>

                {/* Search and Filter Controls */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 my-6">
                    <div className="mt-4">
                        <div className="relative w-full md:w-[35vw]">
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                </svg>
                            </div>
                            <input
                                type="text"
                                className="w-full pr-10 pl-4 py-2 border border-slate-300 rounded-lg focus:ring-primary focus:border-primary"
                                placeholder="ابحث بالاسم..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <button
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                            </svg>
                            {isFilterOpen ? 'إغلاق الفلاتر' : 'تصفية النتائج'}
                        </button>
                        <button
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition-colors"
                            onClick={() => setIsAddModalOpen(true)}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            إضافة عضو جديد
                        </button>
                    </div>
                </div>

                {/* Filter Panel */}
                {isFilterOpen && (
                    <div className="bg-white p-4 shadow-sm rounded-lg border border-slate-200 mb-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    الفرع العائلي
                                </label>
                                <select
                                    value={selectedBranch}
                                    onChange={(e) => handleBranchFilter(e.target.value as any || "")}
                                    className="w-full p-2 border border-slate-300 rounded-md focus:ring-primary focus:border-primary"
                                >
                                    <option value="">كل الفروع</option>
                                    {familyBranches.map((branch: any, index: any) => (
                                        <option key={index} value={branch.value}>{branch.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    الأب
                                </label>
                                <select
                                    value={fatherFilter}
                                    onChange={(e) => setFatherFilter(e.target.value)}
                                    className="w-full p-2 border border-slate-300 rounded-md focus:ring-primary focus:border-primary"
                                >
                                    <option value="">كل الآباء</option>
                                    {allFathers.map((father) => (
                                        <option key={father} value={father}>{father}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    الأم
                                </label>
                                <select
                                    value={motherFilter}
                                    onChange={(e) => setMotherFilter(e.target.value)}
                                    className="w-full p-2 border border-slate-300 rounded-md focus:ring-primary focus:border-primary"
                                >
                                    <option value="">كل الأمهات</option>
                                    {allMothers.map((mother) => (
                                        <option key={mother} value={mother}>{mother}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    الجنس
                                </label>
                                <select
                                    value={genderFilter}
                                    onChange={(e) => setGenderFilter(e.target.value)}
                                    className="w-full p-2 border border-slate-300 rounded-md focus:ring-primary focus:border-primary"
                                >
                                    <option value="">كل الأجناس</option>
                                    {genderOptions.map((gender) => (
                                        <option key={gender.value} value={gender.value}>{gender.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    لديه حساب
                                </label>
                                <select
                                    value={hasAccountFilter === null ? '' : hasAccountFilter ? 'true' : 'false'}
                                    onChange={(e) => setHasAccountFilter(e.target.value === '' ? null : e.target.value === 'true')}
                                    className="w-full p-2 border border-slate-300 rounded-md focus:ring-primary focus:border-primary"
                                >
                                    <option value="">الكل</option>
                                    <option value="true">لديه حساب</option>
                                    <option value="false">ليس لديه حساب</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex justify-end mt-4 gap-2">
                            <button
                                onClick={clearFilters}
                                className="px-3 py-1 text-sm text-primary border border-primary rounded-md hover:bg-slate-50"
                            >
                                مسح الفلاتر
                            </button>
                        </div>
                    </div>
                )}

                {/* Members Table */}
                <div className="overflow-x-auto rounded-lg border border-slate-200">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider"></th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
                                    onClick={() => handleSort('fname')}
                                >
                                    <div className="flex items-center justify-center gap-1">
                                        الاسم
                                        {getSortIcon('fname')}
                                    </div>
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
                                    onClick={() => handleSort('familyBranch')}
                                >
                                    <div className="flex items-center justify-center gap-1">
                                        الفرع العائلي
                                        {getSortIcon('familyBranch')}
                                    </div>
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
                                    onClick={() => handleSort('parents')}
                                >
                                    <div className="flex items-center justify-center gap-1">
                                        الأب
                                        {getSortIcon('parents')}
                                    </div>
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
                                    onClick={() => handleSort('parents')}
                                >
                                    <div className="flex items-center justify-center gap-1">
                                        الأم
                                        {getSortIcon('parents')}
                                    </div>
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
                                    onClick={() => handleSort('gender')}
                                >
                                    <div className="flex items-center justify-center gap-1">
                                        الجنس
                                        {getSortIcon('gender')}
                                    </div>
                                </th>
                                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                                    لديه حساب
                                </th>

                                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                                    الإجراءات
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                            {sortedMembers.length > 0 ? (
                                sortedMembers.map((member) => (
                                    <tr key={member._id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="h-10 w-10 flex justify-center">
                                                {member.image ? (
                                                    <img
                                                        src={member.image}
                                                        alt={`${member.fname} ${member.lname}`}
                                                        className="h-10 w-10 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-medium">
                                                        {member.fname.charAt(0)}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-center">
                                                <div className="font-medium text-slate-900">
                                                    {member.fname} {member.lname}
                                                </div>
                                                <div className="text-sm text-slate-500">
                                                    {member.birthday ? new Date(member.birthday).toLocaleDateString('ar-EG') : '-'}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-center">
                                                <div className="font-medium text-slate-900">
                                                    {member.familyBranch.name != null ? member.familyBranch.name : 'غير محدد'}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-center">
                                                <div className="font-medium text-slate-900">
                                                    {member.parents?.father && typeof member.parents.father !== 'string' ?
                                                        `${member.parents.father.fname} ${member.parents.father.lname}` : '-'}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-center">
                                                <div className="font-medium text-slate-900">
                                                    {member.parents?.mother && typeof member.parents.mother !== 'string' ?
                                                        `${member.parents.mother.fname} ${member.parents.mother.lname}` : '-'}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex justify-center">
                                                <span className={`px-2 py-1 text-responsive-sm font-semibold rounded-md ${member.gender === 'ذكر' ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'}`}>
                                                    {genderOptions.find(g => g.value === member.gender)?.label || member.gender}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-center">
                                                <div className="font-medium text-slate-900">
                                                    {member.isUser ? (
                                                        <CheckIcon className="h-5 w-5 text-green-500 inline" />
                                                    ) : (
                                                        <XIcon className="h-5 w-5 text-red-500 inline" />
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                                            <div className="flex justify-center space-x-2 gap-2">
                                                {
                                                    member?.userId?.role[0] != 'مدير النظام' && (
                                                        <>
                                                            <button
                                                                onClick={() => member._id && handleEdit(member._id)}
                                                                className="text-slate-600 hover:text-primary transition-colors"
                                                                title="تعديل"
                                                            >
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                                </svg>
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteClick(member)}
                                                                className="text-red-700 hover:text-red-800 transition-colors"
                                                                title="حذف"
                                                                disabled={isDeleting}
                                                            >
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                </svg>
                                                            </button>

                                                        </>
                                                    )
                                                }
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={8} className="px-6 py-4 text-center text-slate-500">
                                        لا توجد بيانات متاحة
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {pagination && pagination.totalPages > 1 && (
                    <div className="flex items-center justify-between flex-col-reverse gap-4 md:flex-row mt-4 px-2">
                        <div className="text-sm text-slate-500">
                            عرض <span className="font-medium">{(pagination.currentPage - 1) * pagination.pageSize + 1}</span> إلى{' '}
                            <span className="font-medium">
                                {Math.min(pagination.currentPage * pagination.pageSize, pagination.totalMembers)}
                            </span>{' '}
                            من <span className="font-medium">{pagination.totalMembers}</span> نتائج
                        </div>
                        <div className="flex space-x-2 gap-2">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className={`px-3 py-1 rounded-md border ${currentPage === 1 ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-white text-primary hover:bg-slate-50'}`}
                            >
                                السابق
                            </button>
                            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((pageNum) => (
                                <button
                                    key={pageNum}
                                    onClick={() => handlePageChange(pageNum)}
                                    className={`px-3 py-1 rounded-md ${currentPage === pageNum ? 'bg-primary text-white' : 'bg-white text-primary hover:bg-slate-100 border'}`}
                                >
                                    {pageNum}
                                </button>
                            ))}
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === pagination.totalPages}
                                className={`px-3 py-1 rounded-md border ${currentPage === pagination.totalPages ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-white text-primary hover:bg-slate-50'}`}
                            >
                                التالي
                            </button>
                        </div>
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                <Modal
                    isOpen={isDeleteModalOpen}
                    onClose={() => !isDeleting && setIsDeleteModalOpen(false)}
                    type="delete"
                    title="حذف عضو"
                    onConfirm={confirmDelete}
                >
                    <div className="flex items-center gap-4">
                        <div className="flex-shrink-0 p-2 bg-red-100 rounded-full text-red-600">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </div>
                        <p className="text-gray-700">
                            هل أنت متأكد من حذف العضو {memberToDelete?.fname} {memberToDelete?.lname}؟ لا يمكن التراجع عن هذا الإجراء.
                        </p>
                    </div>
                </Modal>

                {/* Add Member Modal */}
                {isAddModalOpen && (
                    <Modal
                        isOpen={isAddModalOpen}
                        onClose={() => setIsAddModalOpen(false)}
                        title="إضافة عضو جديد"
                        extraStyle="bg-primary"
                        showFooter={false}
                    >
                        <MemberForm
                            onSuccess={() => {
                                setIsAddModalOpen(false);
                                refetchMembers?.();
                            }}
                        />
                    </Modal>
                )}

                {openGuide && (
                    <FamilyTreeGuide isOpen={openGuide} handleClose={() => setOpenGuide(false)} />
                )}
            </div>
        </div>
    );
};

export default MembersTable;
