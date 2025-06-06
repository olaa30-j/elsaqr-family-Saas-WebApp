import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../../../ui/Modal";
import type { Member } from "../../../../types/member";
import { toast } from "react-toastify";
import { useDeleteMemberMutation } from "../../../../store/api/memberApi";
import { genderOptions, familyBranches } from "../../../../types/member";
import MemberForm from "./MemberForm";

interface MembersTableProps {
    currentPage?: number;
    itemsPerPage?: number;
    membersData: Member[] | undefined;
    refetchMembers?: () => void;
}

type FilterOptions = {
    gender?: Member['gender'];
    familyBranch?: string;
    isRoot?: boolean;
};

const MembersTable: React.FC<MembersTableProps> = ({
    currentPage: initialPage = 1,
    itemsPerPage = 10,
    membersData,
    refetchMembers
}) => {
    const navigate = useNavigate();
    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(initialPage);
    const [totalPages, setTotalPages] = useState(1);
    const [sortConfig, setSortConfig] = useState<{ key: keyof Member; direction: 'asc' | 'desc' } | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [memberToDelete, setMemberToDelete] = useState<Member | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filters, setFilters] = useState<FilterOptions>({});
    const [deleteMember, { isLoading: isDeleting }] = useDeleteMemberMutation();

    useEffect(() => {
        setLoading(true);
        try {
            const data = membersData || [];
            setMembers(data);
            setTotalPages(Math.ceil(data.length / itemsPerPage));
        } catch (error) {
            console.error('Error loading members data:', error);
            toast.error('حدث خطأ في تحميل بيانات الأعضاء');
        } finally {
            setLoading(false);
        }
    }, [membersData, itemsPerPage]);

    const handleSort = (key: keyof Member) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig?.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const filteredMembers = members.filter(member => {
        const fullName = `${member.fname} ${member.lname}`.toLowerCase();
        const matchesSearch = searchTerm === "" ||
            fullName.includes(searchTerm.toLowerCase()) ||
            member.fname.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.lname.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesGender = !filters.gender || member.gender === filters.gender;
        const matchesBranch = !filters.familyBranch || member.familyBranch === filters.familyBranch;
        const matchesRoot = filters.isRoot === undefined ||
            (filters.isRoot ? !member.father : !!member.father);

        return matchesSearch && matchesGender && matchesBranch && matchesRoot;
    });

    const sortedMembers = [...filteredMembers].sort((a, b) => {
        if (!sortConfig) return 0;

        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue === undefined) return 1;
        if (bValue === undefined) return -1;

        // معالجة خاصة لفرز الأسماء العربية
        if (typeof aValue === 'string' && typeof bValue === 'string') {
            return sortConfig.direction === 'asc'
                ? aValue.localeCompare(bValue, 'ar')
                : bValue.localeCompare(aValue, 'ar');
        }

        if (aValue < bValue) {
            return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
            return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
    });

    const paginatedMembers = sortedMembers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleEdit = (memberId: string) => {
        navigate(`/admin/members/${memberId}`);
    };

    const handleDeleteClick = (member: Member) => {
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
            console.error("Delete error:", error);
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleFilterChange = (key: keyof FilterOptions, value: string | boolean) => {
        setFilters(prev => ({
            ...prev,
            [key]: value === 'all' ? undefined : value
        }));
        setCurrentPage(1);
    };

    const clearFilters = () => {
        setFilters({});
        setSearchTerm("");
    };



    const getSortIcon = (key: keyof Member) => {
        if (!sortConfig || sortConfig.key !== key) {
            return (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2"
                    stroke="currentColor" className="w-4 h-4 opacity-50">
                    <path strokeLinecap="round" strokeLinejoin="round"
                        d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"></path>
                </svg>
            );
        }
        return (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2"
                stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round"
                    d={sortConfig.direction === 'asc' ?
                        "M19.5 8.25l-7.5 7.5-7.5-7.5" :
                        "M4.5 15.75l7.5-7.5 7.5 7.5"}></path>
            </svg>
        );
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="relative flex flex-col w-full h-full text-primary bg-white rounded-xl shadow-sm">
            <div className="p-6">
                <div>
                    <h3 className="text-2xl font-bold text-primary">إدارة أعضاء العائلة</h3>
                    <p className="text-slate-500 mt-1">قائمة بجميع أعضاء العائلة المسجلين في النظام</p>
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
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Gender Filter */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    الجنس
                                </label>
                                <select
                                    value={filters.gender || 'all'}
                                    onChange={(e) => handleFilterChange('gender', e.target.value)}
                                    className="w-full p-2 border border-slate-300 rounded-md focus:ring-primary focus:border-primary"
                                >
                                    <option value="all">الكل</option>
                                    {genderOptions.map(({ value, label }) => (
                                        <option key={value} value={value}>
                                            {label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Family Branch Filter */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    الفرع العائلي
                                </label>
                                <select
                                    value={filters.familyBranch || 'all'}
                                    onChange={(e) => handleFilterChange('familyBranch', e.target.value)}
                                    className="w-full p-2 border border-slate-300 rounded-md focus:ring-primary focus:border-primary"
                                >
                                    <option value="all">الكل</option>
                                    {familyBranches.map((branch: any) => (
                                        <option key={branch} value={branch}>
                                            {branch}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Root Members Filter */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    نوع العضو
                                </label>
                                <select
                                    value={filters.isRoot === undefined ? 'all' : filters.isRoot ? 'root' : 'notRoot'}
                                    onChange={(e) => handleFilterChange('isRoot', e.target.value === 'root')}
                                    className="w-full p-2 border border-slate-300 rounded-md focus:ring-primary focus:border-primary"
                                >
                                    <option value="all">الكل</option>
                                    <option value="root">الأب الجذري</option>
                                    <option value="notRoot">أعضاء عاديين</option>
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
                                    onClick={() => handleSort('gender')}
                                >
                                    <div className="flex items-center justify-center gap-1">
                                        الجنس
                                        {getSortIcon('gender')}
                                    </div>
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
                                    onClick={() => handleSort('father')}
                                >
                                    <div className="flex items-center justify-center gap-1">
                                        الأب
                                        {getSortIcon('father')}
                                    </div>
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
                                    onClick={() => handleSort('husband')}
                                >
                                    <div className="flex items-center justify-center gap-1">
                                        الزوج
                                        {getSortIcon('husband')}
                                    </div>
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
                                >
                                    الزوجات
                                </th>
                                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                                    الإجراءات
                                </th>
                            </tr>
                        </thead>

                        <tbody className="bg-white divide-y divide-slate-200">
                            {paginatedMembers.length > 0 ? (
                                paginatedMembers.map((member) => {
                                    // البحث عن الأب
                                    const father = members.find(m => m._id === member.father);
                                    // البحث عن الزوج
                                    const husband = members.find(m => m._id === member.husband);
                                    // البحث عن الزوجات
                                    const wives = member.wives?.map(wifeId =>
                                        members.find(m => m._id === wifeId)
                                    ).filter((wife): wife is Member => wife !== undefined) || [];

                                    return (
                                        <tr key={member._id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex justify-center">
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
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-center">
                                                    <div className="font-medium text-slate-900">
                                                        {member.familyBranch}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex justify-center">
                                                    <span className={`px-2 py-1 text-responsive-sm font-semibold rounded-md ${member.gender === 'ذكر' ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'
                                                        }`}>
                                                        {genderOptions.find(g => g.value === member.gender)?.label || member.gender}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 text-center">
                                                {father ? `${father.fname} ${father.lname}` : '---'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 text-center">
                                                {husband ? `${husband.fname} ${husband.lname}` : '---'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 text-center">
                                                {wives.length > 0 ? (
                                                    <div className="flex flex-wrap justify-center gap-1">
                                                        {wives.map((wife, index) => (
                                                            <span key={index} className="bg-slate-100 px-2 py-1 rounded-md">
                                                                {wife.fname}
                                                            </span>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    '---'
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                                                <div className="flex justify-center space-x-2 gap-2">
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
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
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
                <div className="flex items-center justify-between mt-4 px-2">
                    <div className="text-sm text-slate-500">
                        عرض <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> إلى{' '}
                        <span className="font-medium">
                            {Math.min(currentPage * itemsPerPage, filteredMembers.length)}
                        </span>{' '}
                        من <span className="font-medium">{filteredMembers.length}</span> نتائج
                    </div>
                    <div className="flex space-x-2 gap-2">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`px-3 py-1 rounded-md border ${currentPage === 1 ?
                                'bg-slate-100 text-slate-400 cursor-not-allowed' :
                                'bg-white text-primary hover:bg-slate-50'
                                }`}
                        >
                            السابق
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => handlePageChange(page)}
                                className={`px-3 py-1 rounded-md ${currentPage === page ?
                                    'bg-primary text-white' :
                                    'bg-white text-primary hover:bg-slate-100 border'
                                    }`}
                            >
                                {page}
                            </button>
                        ))}
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className={`px-3 py-1 rounded-md border ${currentPage === totalPages ?
                                'bg-slate-100 text-slate-400 cursor-not-allowed' :
                                'bg-white text-primary hover:bg-slate-50'
                                }`}
                        >
                            التالي
                        </button>
                    </div>
                </div>

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
            </div>
        </div>
    );
};

export default MembersTable;