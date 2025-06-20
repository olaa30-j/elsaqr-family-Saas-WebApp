import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useGetMembersQuery } from '../../../../store/api/memberApi';
import { ZoomIn, ZoomOut } from 'lucide-react';
import type { GetMembers } from '../../../../types/member';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { Link } from 'react-router-dom';
import { AddButton } from './reusable/AddButton';
import { MemberCard } from './reusable/MemberCard';

interface FamilyTreeProps {
    familyBranch: string;
}

const FamilyTree: React.FC<FamilyTreeProps> = ({ familyBranch }) => {
    const { data: membersData } = useGetMembersQuery({
        limit: 1000
    });

    const members = membersData?.data || [];

    const familyTree = useMemo(() => {
        const husband = members.find(m =>
            (m.familyRelationship === 'الجد الأعلى' || m.familyRelationship === 'ابن') &&
            (m.familyBranch.branchOwner && m._id) &&
            (m.familyBranch._id === familyBranch)
        );

        if (!husband) return null;

        const sortChildren = (children: GetMembers[]) => {
            return children.sort((a, b) => {
                if (a.gender === 'ذكر' && b.gender !== 'ذكر') return -1;
                if (a.gender !== 'ذكر' && b.gender === 'ذكر') return 1;
                return 0;
            });
        };

        const wives = members.filter(m =>
            m.familyRelationship === 'زوجة' &&
            m.husband?._id === husband._id);

        const children = sortChildren(
            members.filter(m => {
                const isChild = m.familyRelationship === 'ابن' || m.familyRelationship === 'ابنة';

                const fatherMatch = m.parents?.father &&
                    (typeof m.parents.father === 'object'
                        ? m.parents.father._id === husband._id
                        : m.parents.father === husband._id);

                return isChild && fatherMatch;
            })
        );

        return {
            husband,
            wives,
            children
        };
    }, [members]);


    const familyStats = useMemo(() => {
        if (!familyTree) return null;

        const grandChildren = familyTree.children.reduce((acc, child) => {
            const childrenOfChild = members.filter(m => {
                const fatherMatch = m.parents?.father &&
                    (typeof m.parents.father === 'object'
                        ? m.parents.father._id === child._id
                        : m.parents.father === child._id);

                const motherMatch = m.parents?.mother &&
                    (typeof m.parents.mother === 'object'
                        ? m.parents.mother._id === child._id
                        : m.parents.mother === child._id);

                return (m.familyRelationship === 'ابن' || m.familyRelationship === 'ابنة') &&
                    (fatherMatch || motherMatch);
            });
            return acc + childrenOfChild.length;
        }, 0);

        return {
            wives: familyTree.wives.length,
            sons: familyTree.children.filter(c => c.gender === 'ذكر').length,
            daughters: familyTree.children.filter(c => c.gender === 'أنثى').length,
            grandChildren
        };
    }, [familyTree, members]);


    const renderConnectionLine = (type: 'parent' | 'sibling' | 'spouse', position?: 'first' | 'last' | 'middle') => {
        const baseClass = "absolute pointer-events-none border-gray-400";

        if (type === 'parent') {
            return (
                <div className={`${baseClass} top-0 left-1/2 w-0 h-6 border-l-2 border-dashed transform -translate-x-1/2`} />
            );
        }

        if (type === 'spouse') {
            return (
                <div className={`${baseClass} bottom-0 left-1/2 w-0 h-10 border-l-2 border-dashed transform -translate-x-1/2`} />
            );
        }

        if (type === 'sibling') {
            return (
                <>
                    <div className={`${baseClass} top-0 left-1/2 w-0 h-6 border-l-2 border-dashed transform -translate-x-1/2`} />
                    <div className={`${baseClass} top-0 h-0 border-t-2 border-dashed ${position === 'first' ? 'right-1/2 left-0' :
                        position === 'last' ? 'right-0 left-1/2' :
                            'left-0 right-0'
                        }`} />
                </>
            );
        }

        return null;
    };

    const renderChildren = (parentId: string, motherId?: string) => {
        const children = members.filter(member => {
            const isChild = member.familyRelationship === 'ابن' || member.familyRelationship === 'ابنة';

            const fatherMatch = member.parents?.father &&
                (typeof member.parents.father === 'string'
                    ? member.parents.father === parentId
                    : member.parents.father._id === parentId);

            const motherMatch = !motherId ||
                (member.parents?.mother &&
                    (typeof member.parents.mother === 'string'
                        ? member.parents.mother === motherId
                        : member.parents.mother._id === motherId));

            return isChild && fatherMatch && motherMatch;
        });

        const sons = children.filter(child => child.gender === 'ذكر');
        const daughters = children.filter(child => child.gender === 'أنثى');

        if (children.length === 0) {
            return (
                <div className="relative pt-6 family-connector">
                    <div className="absolute top-0 left-0 right-0 h-6 flex justify-center">
                        {renderConnectionLine('parent')}
                    </div>
                    {<AddButton text='إضافة ابن/ابنة' />}
                </div>
            );
        }

        return (
            <div className="relative pt-6 family-connector">
                <div className="absolute top-0 left-0 right-0 h-6 flex justify-center">
                    {renderConnectionLine('parent')}
                </div>

                <ul className="flex justify-center flex-wrap">
                    {sons.map((son, index) => (
                        <motion.li
                            key={son._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="relative px-2"
                        >
                            {(children.length > 1) && (
                                <div className="absolute top-0 left-0 right-0 h-10 flex justify-center">
                                    {renderConnectionLine('sibling',
                                        index === 0 && daughters.length === 0 ? 'first' :
                                            index === sons.length - 1 ? 'last' :
                                                'middle'
                                    )}
                                </div>
                            )}

                            <Link to={`/nested-tree/${son._id}`} className={`${children.length > 1 ? 'pt-6' : 'pt-0'}`}>
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    className="border border-gray-300 px-3 py-2 bg-white rounded-md transition-all duration-300 hover:bg-primary/10 w-fit mx-auto"
                                >
                                    {<MemberCard member={son} role='ابن' />}
                                </motion.div>
                            </Link>

                            {son._id && renderGrandChildren(son?._id)}
                        </motion.li>
                    ))}

                    {daughters.map((daughter, index) => (
                        <motion.li
                            key={daughter._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="relative px-2"
                        >
                            {(children.length > 1) && (
                                <div className="absolute top-0 left-0 right-0 h-10 flex justify-center">
                                    {renderConnectionLine('sibling',
                                        index === 0 && sons.length === 0 ? 'first' :
                                            index === daughters.length - 1 ? 'last' :
                                                'middle'
                                    )}
                                </div>
                            )}

                            <div className={`${children.length > 1 ? 'pt-6' : 'pt-0'}`}>
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    className="border border-gray-300 px-3 py-2 bg-white rounded-md transition-all duration-300 hover:bg-purple-50 w-fit mx-auto"
                                >
                                    {<MemberCard member={daughter} role='ابنة' />}
                                </motion.div>
                            </div>

                            {daughter._id && renderGrandChildren(daughter?._id)}
                        </motion.li>
                    ))}
                </ul>
            </div>
        );
    };
    const renderGrandChildren = (parentId: string) => {
        const grandChildren = members.filter(member => {
            const isChild = member.familyRelationship === 'ابن' || member.familyRelationship === 'ابنة';

            const fatherMatch = member.parents?.father &&
                (typeof member.parents.father === 'object'
                    ? member.parents.father._id === parentId
                    : member.parents.father === parentId);

            const motherMatch = member.parents?.mother &&
                (typeof member.parents.mother === 'object'
                    ? member.parents.mother._id === parentId
                    : member.parents.mother === parentId);

            return isChild && (fatherMatch || motherMatch);
        });

        if (grandChildren.length === 0) return null;

        return (
            <div className="relative pt-6">
                <div className="absolute top-0 left-0 right-0 h-6 flex justify-center">
                    {renderConnectionLine('parent')}
                </div>

                <ul className="flex justify-center flex-wrap gap-2">
                    {grandChildren.map((grandChild, index) => (
                        <motion.li
                            key={grandChild._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="relative px-1"
                        >

                            {
                                (grandChildren.length > 1) && (
                                    <div className="absolute top-0 left-0 right-0 h-10 flex justify-center">
                                        {renderConnectionLine('sibling',
                                            index === 0 ? 'first' :
                                                index === grandChildren.length - 1 ? 'last' :
                                                    'middle'
                                        )}
                                    </div>
                                )

                            }

                            <div className={`${grandChildren.length > 1 ? 'pt-6' : 'pt-0'}`}>
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    className="border border-gray-300 px-2 py-1 bg-white rounded-md transition-all duration-300 hover:bg-green-50"
                                >
                                    {<MemberCard member={grandChild} role={grandChild.familyRelationship === 'ابن' ? 'ابن' : 'ابنة'} />}
                                </motion.div>
                            </div>
                        </motion.li>
                    ))}
                </ul>
            </div>
        );
    };

    if (!familyTree || !familyStats) {
        return (
            <div className="text-center py-4 text-gray-500">
                <p>لا يوجد بيانات للعائلة في هذا الفرع</p>
                {<AddButton text='إضافة رب الأسرة' />}
            </div>
        );
    }

    return (
        <div className="mx-auto p-2 sm:p-4 bg-gray-50 rounded-lg">
            <TransformWrapper
                initialScale={0.7}
                minScale={0.2}
                maxScale={2}
                initialPositionY={0}
                initialPositionX={window.innerWidth / 2}
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
                                    alignItems: 'center',
                                    padding: '20px'
                                }}
                            >
                                <div className="relative mx-auto scrollbar-hide" style={{
                                    minWidth: 'max-content',
                                    maxWidth: '100%',
                                    transformOrigin: 'center center',
                                }}>
                                    <ul className="flex flex-col items-center justify-center mx-auto space-y-4 scrollbar-hide">
                                        {/* Husband */}
                                        <motion.li
                                            key={familyTree.husband._id}
                                            className="text-center list-none mx-auto"
                                        >
                                            <motion.div
                                                whileHover={{ scale: 1.05 }}
                                                className="border border-gray-300 bg-white rounded-md mx-auto w-fit p-4 relative"
                                            >
                                                {<MemberCard member={familyTree.husband} role={'زوج'} />}
                                                <div className="absolute -bottom-6 left-0 right-2 h-24 flex justify-center pointer-events-none z-[-1]">
                                                    {renderConnectionLine('spouse')}
                                                </div>
                                            </motion.div>

                                            {/* Wives and Children */}
                                            <div className="relative pt-6">
                                                {familyTree.wives.length > 0 ? (
                                                    <ul className="flex flex-wrap justify-center gap-4">
                                                        {familyTree.wives.map((wife, index) => (
                                                            <motion.li
                                                                key={wife._id}
                                                                className="relative"
                                                                initial={{ opacity: 0, x: -10 }}
                                                                animate={{ opacity: 1, x: 0 }}
                                                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                                            >
                                                                {
                                                                    familyTree.wives.length > 1 && (
                                                                        <div className="absolute top-0 left-0 -right-4 h-10 flex justify-center">
                                                                            {renderConnectionLine('sibling',
                                                                                index === 0 ? 'first' :
                                                                                    index === familyTree.wives.length - 1 ? 'last' :
                                                                                        'middle'
                                                                            )}
                                                                        </div>
                                                                    )
                                                                }

                                                                <div className={`${familyTree.wives.length > 1 ? 'pt-6' : 'pt-0'}`}>
                                                                    <motion.div
                                                                        whileHover={{ scale: 1.05 }}
                                                                        className="border border-gray-300 px-3 py-2 bg-white rounded-md transition-all duration-300 hover:bg-purple-50 w-fit mx-auto"
                                                                    >
                                                                        {<MemberCard member={wife} role='زوجة' />}
                                                                    </motion.div>
                                                                    {/* عرض أبناء هذه الزوجة مع الزوج */}
                                                                    {familyTree.husband._id && wife._id && renderChildren(familyTree.husband._id, wife._id)}

                                                                </div>
                                                            </motion.li>
                                                        ))}
                                                    </ul>
                                                ) : (
                                                    <div className="flex justify-center">
                                                        {<AddButton text='إضافة زوجة' />}
                                                    </div>
                                                )}

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