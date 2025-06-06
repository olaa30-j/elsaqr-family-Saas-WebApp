// import React, { useState, useEffect, useMemo } from 'react';
// import { useController } from 'react-hook-form';
// import { useGetMembersQuery } from '../../../../store/api/memberApi';

// interface RelationshipSearchInputProps {
//     control: any;
//     errors: any;
//     name: string;
//     familyBranch?: string;
//     relationshipType: 'زوج' | 'زوجة';
//     disabled?: boolean;
//     isMulti?: boolean;
// }

// export const RelationshipSearchInput: React.FC<RelationshipSearchInputProps> = ({
//     control,
//     errors,
//     name,
//     familyBranch,
//     relationshipType,
//     disabled,
//     isMulti = false
// }) => {
//     const [searchQuery, setSearchQuery] = useState('');
//     const [debouncedQuery, setDebouncedQuery] = useState('');
//     const [page, setPage] = useState(1);
//     const [selectedItems, setSelectedItems] = useState<any[]>([]);

//     useEffect(() => {
//         const timerId = setTimeout(() => {
//             setDebouncedQuery(searchQuery);
//         }, 300);

//         return () => {
//             clearTimeout(timerId);
//         };
//     }, [searchQuery]);

//     const { field } = useController({
//         name,
//         control,
//         rules: !isMulti ? { required: 'هذا الحقل مطلوب' } : undefined
//     });

//     const { data: membersData, isLoading } = useGetMembersQuery({
//         page,
//         limit: 10,
//         familyBranch
//     });

//     // Define filteredMembers based on the membersData
//     const filteredMembers = useMemo(() => {
//         if (!membersData?.data) return [];
//         return membersData.data.filter((member: any) => 
//             `${member.fname} ${member.lname}`.toLowerCase().includes(debouncedQuery.toLowerCase())
//         );
//     }, [membersData, debouncedQuery]);

//     const handleSelectItem = (member: any) => {
//         if (isMulti) {
//             if (selectedItems.length >= 4) {
//                 return;
//             }
//             const newItems = [...selectedItems, member];
//             setSelectedItems(newItems);
//             field.onChange(newItems.map(item => item._id));
//         } else {
//             setSelectedItems([member]);
//             field.onChange(member._id);
//             setSearchQuery(`${member.fname} ${member.lname}`);
//         }
//     };

//     const handleRemoveItem = (memberId: string) => {
//         const newItems = selectedItems.filter(item => item._id !== memberId);
//         setSelectedItems(newItems);
//         field.onChange(isMulti ? newItems.map(item => item._id) : '');
//         if (!isMulti) setSearchQuery('');
//     };

//     return (
//         <div>
//             <div className="relative">
//                 <input
//                     type="text"
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                     className="block w-full rounded-md border border-gray-300 p-2 focus:ring-indigo-500 focus:border-indigo-500"
//                     disabled={disabled}
//                     placeholder={`ابحث عن ${relationshipType === 'زوج' ? 'زوج' : 'زوجة'}`}
//                 />

//                 {debouncedQuery && (
//                     <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-300 max-h-60 overflow-auto">
//                         {isLoading ? (
//                             <div className="p-2 text-center">جاري التحميل...</div>
//                         ) : filteredMembers.length ? (
//                             filteredMembers
//                                 .filter(member => !selectedItems.some(item => item._id === member._id))
//                                 .map((member) => (
//                                     <div
//                                         key={member._id}
//                                         className="p-2 hover:bg-gray-100 cursor-pointer"
//                                         onClick={() => handleSelectItem(member)}
//                                     >
//                                         {member.fname} {member.lname} ({member.familyBranch})
//                                     </div>
//                                 ))
//                         ) : (
//                             <div className="p-2 text-center">لا توجد نتائج</div>
//                         )}
//                     </div>
//                 )}
//             </div>

//             {selectedItems.length > 0 && (
//                 <div className="mt-2 space-y-2">
//                     {selectedItems.map((item) => (
//                         <div key={item._id} className="flex items-center justify-between p-2 bg-gray-100 rounded-md">
//                             <span>
//                                 {item.fname} {item.lname}
//                             </span>
//                             <button
//                                 type="button"
//                                 onClick={() => handleRemoveItem(item._id)}
//                                 className="text-red-500 hover:text-red-700"
//                                 disabled={disabled}
//                             >
//                                 إزالة
//                             </button>
//                         </div>
//                     ))}
//                 </div>
//             )}

//             {errors[name] && (
//                 <p className="mt-1 text-sm text-red-600">{errors[name].message}</p>
//             )}
//         </div>
//     );
// };