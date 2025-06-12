import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useGetMembersQuery } from '../../../../store/api/memberApi';
import { DEFAULT_IMAGE } from '../../../auth/RegisterationForm';
import { Plus, ZoomIn, ZoomOut } from 'lucide-react';
import type { Member } from '../../../../types/member';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

interface FamilyTreeProps {
    familyBranch: string;
}

const FamilyTree: React.FC<FamilyTreeProps> = ({ familyBranch }) => {
    const { data: membersData } = useGetMembersQuery({
        familyBranch,
        limit: 1000
    });

    const members = membersData?.data || [];

    const familyTree = useMemo(() => {
        const tree: any = {};

        const husband = members.find((m: any) => m.familyRelationship === 'زوج');

        if (!husband) return null;

        tree.husband = husband;
        tree.wives = members.filter((m: any) => m.familyRelationship === 'زوجة');
        tree.children = members.filter((m: any) =>
            m.familyRelationship === 'ابن' || m.familyRelationship === 'ابنة'
        );
        tree.grandChildren = members.filter((m: any) => m.familyRelationship === 'حفيد');

        return tree;
    }, [members]);

    const formatDate = (date: Date | string | undefined) => {
        if (!date) return 'غير معروف';
        const d = new Date(date);
        return isNaN(d.getTime()) ? 'غير معروف' : d.toLocaleDateString('ar-EG');
    };

    const renderMemberCard = (member: Member, role: string) => {
        return (
            <div className="flex flex-col items-center min-w-[120px] max-w-[150px] mx-2">
                <div className="w-full h-48 bg-gray-200 mb-2 overflow-hidden flex items-center justify-center border border-gray-300">
                    {member.image ? (
                        <img
                            src={member.image || DEFAULT_IMAGE}
                            alt={`${member.fname} ${member.lname}`}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="text-gray-400 text-2xl">
                            {role === 'زوج' || role === 'ابن' ? '👨' : '👩'}
                        </div>
                    )}
                </div>

                <div className="text-center">
                    <p className="font-medium text-gray-700 text-sm leading-tight">
                        {member.fname} {member.lname} <span className="text-xs text-gray-400">({role})</span>
                    </p>

                    <div className="text-xs text-gray-500 mt-1">
                        <p>{formatDate(member.birthday)}</p>
                        {member.deathDate && (
                            <p>{formatDate(member.deathDate)}</p>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    const familyStats = useMemo(() => {
        if (!familyTree) return null;

        return {
            wives: familyTree.wives.length,
            sons: familyTree.children.filter((c: any) => c.familyRelationship === 'ابن').length,
            daughters: familyTree.children.filter((c: any) => c.familyRelationship === 'ابنة').length,
            grandChildren: familyTree.grandChildren.length
        };
    }, [familyTree]);

    const renderAddButton = (text: string, onClick?: () => void) => {
        return (
            <motion.div
                whileHover={{ scale: 1.05 }}
                className="border border-dashed border-gray-400 px-3 py-2 bg-gray-50 rounded-md transition-all duration-300 hover:bg-blue-50 cursor-pointer min-w-[120px] max-w-[150px] mx-auto"
                onClick={onClick}
            >
                <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-gray-200 mb-1 overflow-hidden flex items-center justify-center">
                        <div className="text-gray-400 text-xl">
                            <Plus className='w-5 h-5' />
                        </div>
                    </div>
                    <div className="text-center">
                        <p className="font-medium text-gray-700 text-sm">{text}</p>
                    </div>
                </div>
            </motion.div>
        );
    };

    const renderConnectionLine = (isFirstChild = false, isLastChild = false) => {
        return (
            <div className="absolute top-0 left-0 right-0 h-10 flex justify-center pointer-events-none">
                {/* الخط العمودي الرئيسي */}
                <div
                    className={`absolute top-0 left-1/2 w-0 h-full border-l-2 border-gray-300 transform -translate-x-1/2 h-8`}
                />

                {/* الخط الأفقي */}
                {(!isFirstChild || !isLastChild) && (
                    <div
                        className={`absolute top-0 left-0 right-0 h-0 border-t-2 border-gray-300
                        ${isLastChild ? 'left-1/2 right-0' : ''}
                        ${isFirstChild ? 'left-0 right-1/2' : ''}
                        ${!isFirstChild && !isLastChild ? 'left-0 right-0' : ''}`}
                    />
                )}
            </div>
        );
    };

    if (!familyTree || !familyStats) {
        return (
            <div className="text-center py-4 text-gray-500">
                <p>لا يوجد بيانات للعائلة في هذا الفرع</p>
            </div>
        );
    }

    const renderChildren = (wifeId?: string) => {
        let children = familyTree.children;
        if (wifeId) {
            children = children.filter((child: Member) => child.data?.motherId === wifeId);
        }

        const sons = children.filter((child: Member) => child.familyRelationship === 'ابن');
        const daughters = children.filter((child: Member) => child.familyRelationship === 'ابنة');

        return (
            <div className="relative pt-6">
                {children.length > 0 && (
                    <div className="absolute top-0 left-0 right-0 h-6 flex justify-center pointer-events-none">
                        {/* الخط العمودي الرئيسي */}
                        <div
                            className={`absolute top-0 left-1/2 w-0 h-full border-l-2 border-gray-300 transform -translate-x-1/2
                            ${children.length > 0 ? '' : 'h-5'}`}
                        />
                    </div>
                )
                }

                <ul className="flex justify-center">
                    {/* عرض البنات أولاً */}
                    {daughters.map((daughter: Member, index: number) => (
                        <motion.li
                            key={daughter._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="relative px-2"
                        >
                            {renderConnectionLine(index === 0 && sons.length === 0, index === daughters.length - 1 && sons.length === 0)}

                            <div className="pt-6">
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    className="border border-gray-300 px-3 py-2 bg-white rounded-md transition-all duration-300 hover:bg-purple-50"
                                >
                                    {renderMemberCard(daughter, 'ابنة')}
                                </motion.div>

                                {renderGrandChildren(daughter._id || '')}
                            </div>
                        </motion.li>
                    ))}

                    {/* عرض الأبناء */}
                    {sons.map((son: Member, index: number) => (
                        <motion.li
                            key={son._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="relative px-2"
                        >
                            {renderConnectionLine(
                                index === 0 && sons.length === 0,
                                index === daughters.length - 1
                            )}

                            <div className="pt-6">
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    className="border border-gray-300 px-3 py-2 bg-white rounded-md transition-all duration-300 hover:bg-primary/10"
                                >
                                    {renderMemberCard(son, 'ابن')}
                                </motion.div>

                                {renderGrandChildren(son._id || '')}
                            </div>
                        </motion.li>
                    ))}

                    {/* زر إضافة ابن إذا لم يكن هناك أبناء */}
                    {children.length === 0 && (
                        <motion.li
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="relative px-2"
                        >
                            {children.length == 0 && (
                                <div className="absolute -top-10 left-0 right-0 h-20 flex justify-center pointer-events-none z-[-1]">
                                    {/* الخط العمودي الرئيسي */}
                                    <div
                                        className={`absolute top-0 left-1/2 w-0 h-full border-l-2 border-gray-300 transform -translate-x-1/2
                                        ${children.length > 0 ? '' : 'h-5'}`}
                                    />
                                </div>
                            )
                            }
                            <div className="pt-6">
                                {renderAddButton('إضافة ابن/ابنة')}
                            </div>
                        </motion.li>
                    )}
                </ul>
            </div >
        );
    };

    const renderGrandChildren = (parentId: string) => {
        const grandChildren = familyTree.grandChildren.filter((gc: Member) =>
            gc.data?.parentId === parentId
        );

        return (
            <div className="relative pt-6">
                {grandChildren.length > 0 && (
                    <div className="absolute -top-5 left-0 right-0 h-10 flex justify-center pointer-events-none">
                        {/* الخط العمودي الرئيسي */}
                        <div
                            className={`absolute top-0 left-1/2 w-0 h-full border-l-2 border-gray-300 transform -translate-x-1/2
                            ${grandChildren.length > 0 ? '' : 'h-5'}`}
                        />
                    </div>
                )
                }
                <ul className="flex justify-center">
                    {grandChildren.map((grandChild: Member) => (
                        <motion.li
                            key={grandChild._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="relative px-2"
                        >
                            <div className="pt-6">
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    className="border border-gray-300 px-3 py-2 bg-white rounded-md transition-all duration-300 hover:bg-green-50"
                                >
                                    {renderMemberCard(grandChild, 'حفيد')}
                                </motion.div>
                            </div>
                        </motion.li>
                    ))}

                    {/* زر إضافة حفيد إذا لم يكن هناك أحفاد */}
                    {grandChildren.length === 0 && (
                        <motion.li
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="relative px-2"
                        >
                            {grandChildren.length == 0 && (
                                <div className="absolute -top-10 left-0 right-0 h-20 flex justify-center pointer-events-none z-[-1]">
                                    {/* الخط العمودي الرئيسي */}
                                    <div
                                        className={`absolute top-0 left-1/2 w-0 h-full border-l-2 border-gray-300 transform -translate-x-1/2
                            ${grandChildren.length > 0 ? '' : 'h-5'}`}
                                    />
                                </div>
                            )
                            }
                            <div className="pt-6">
                                {renderAddButton('إضافة حفيد')}
                            </div>
                        </motion.li>
                    )}
                </ul>
            </div>
        );
    };

    return (
        <div className="mx-auto p-2 sm:p-4 bg-gray-50 rounded-lg">
            <TransformWrapper
                initialScale={1}
                minScale={0.5}
                maxScale={3}
                wheel={{ step: 0.1 }}
                doubleClick={{ disabled: true }}
                limitToBounds={false}
            >
                {({ zoomIn, zoomOut, resetTransform }) => (
                    <>
                        {/* Header Section */}
                        <div className="flex flex-col items-center gap-4 mb-4 bg-white p-3 sm:p-4 rounded-lg shadow-sm border border-gray-200">
                            <div className='flex flex-col md:flex-row justify-between w-full gap-3'>
                                <div className="text-right">
                                    <h2 className="text-lg sm:text-xl font-bold text-primary">
                                        {familyTree.husband.fname} {familyTree.husband.lname}
                                    </h2>
                                    <p className="text-sm sm:text-base text-gray-600">فرع: {familyBranch}</p>
                                </div>

                                <div className="flex gap-3 sm:gap-4 flex-wrap justify-center">
                                    {[
                                        { label: 'زوجات', value: familyStats.wives },
                                        { label: 'أبناء', value: familyStats.sons },
                                        { label: 'بنات', value: familyStats.daughters },
                                        { label: 'أحفاد', value: familyStats.grandChildren }
                                    ].map((stat, index) => (
                                        <div key={index} className="text-center min-w-[60px]">
                                            <p className="text-base sm:text-lg font-semibold text-primary">{stat.value}</p>
                                            <p className="text-xs sm:text-sm text-gray-500">{stat.label}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-2 justify-center w-full mt-3">
                                <button
                                    onClick={() => zoomIn()}
                                    className="px-2 py-1 sm:px-3 sm:py-1 bg-primary text-white rounded flex items-center gap-1 text-sm"
                                >
                                    <ZoomIn className="w-4 h-4" />
                                    تكبير
                                </button>
                                <button
                                    onClick={() => zoomOut()}
                                    className="px-2 py-1 sm:px-3 sm:py-1 bg-primary text-white rounded flex items-center gap-1 text-sm"
                                >
                                    <ZoomOut className="w-4 h-4" />
                                    تصغير
                                </button>
                                <button
                                    onClick={() => resetTransform()}
                                    className="px-2 py-1 sm:px-3 sm:py-1 bg-gray-500 text-white rounded text-sm"
                                >
                                    إعادة تعيين
                                </button>
                            </div>
                        </div>

                        {/* Tree Container */}
                        <div className="relative bg-white rounded-lg border border-gray-200"
                            style={{
                                height: '60vh',
                                width: '100%',
                                overflow: 'hidden'
                            }}>
                            <TransformComponent
                                wrapperStyle={{
                                    width: '100%',
                                    height: '100%',
                                    overflow: 'auto',
                                }}
                                contentStyle={{
                                    width: '100%',
                                    minWidth: 'fit-content',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'flex-start',
                                    padding: '20px'
                                }}
                            >
                                <div className="relative mx-auto" style={{
                                    minWidth: 'max-content',
                                    maxWidth: '100%',
                                    transformOrigin: 'center top'
                                }}>
                                    <ul className="flex flex-col items-center space-y-4">
                                        {/* Husband */}
                                        <motion.li
                                            key={familyTree.husband._id}
                                            className="text-center list-none relative"
                                        >
                                            <motion.div
                                                whileHover={{ scale: 1.05 }}
                                                className="border border-gray-300 bg-white rounded-md mx-auto w-fit p-4 relative"
                                            >
                                                {renderMemberCard(familyTree.husband, 'زوج')}
                                                <div className="absolute -bottom-20 left-0 right-0 h-20 flex justify-center pointer-events-none z-[-1]">
                                                    <div className="absolute top-0 left-1/2 w-0 h-full border-l-2 border-gray-300 transform -translate-x-1/2 h-5" />
                                                </div>
                                            </motion.div>

                                            {/* Wives and Children */}
                                            <div className="relative pt-6">
                                                {familyTree.wives.length > 0 ? (
                                                    <ul className="flex flex-wrap justify-center gap-4">
                                                        {familyTree.wives.map((wife: any) => (
                                                            <motion.li key={wife._id} className="relative">
                                                                <div className="flex flex-col items-center">
                                                                    <motion.div
                                                                        whileHover={{ scale: 1.05 }}
                                                                        className="border border-gray-300 bg-white rounded-md p-4"
                                                                    >
                                                                        {renderMemberCard(wife, 'زوجة')}
                                                                    </motion.div>
                                                                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-6 border-l-2 border-gray-300" />

                                                                    {renderChildren(wife._id)}
                                                                </div>
                                                            </motion.li>
                                                        ))}
                                                    </ul>
                                                ) : (
                                                    <div className="flex justify-center">
                                                        {renderAddButton('إضافة زوجة')}
                                                    </div>
                                                )}

                                                {familyTree.wives.length > 0 && renderChildren()}
                                            </div>
                                        </motion.li>
                                    </ul>
                                </div>
                            </TransformComponent>
                        </div>
                    </>
                )}
            </TransformWrapper>
        </div>
    );
};

export default FamilyTree;