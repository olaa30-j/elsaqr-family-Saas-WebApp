import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useGetMembersQuery } from '../../../../store/api/memberApi';
import type { GetMembers } from '../../../../types/member';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { useParams } from 'react-router-dom';
import { FamilyNode } from './reusable/FamilyNode';
import { AddButton } from './reusable/AddButton';
import { ConnectionLine } from './reusable/ConnectionLine';
import { ChildrenList } from './reusable/ChildrenList';
import { FamilyTreeControls } from './reusable/FamilyTreeControls';

const ChildFamilyTree = () => {
    const { memberId } = useParams<{ memberId: string }>();
    const { data: membersData } = useGetMembersQuery({ limit: 1000 });
    const members = membersData?.data || [];

    const familyTree = useMemo(() => {
        const selectedMember = members.find(m => m._id === memberId);
        if (!selectedMember) return null;

        const isMale = selectedMember.gender === 'ذكر';

        if (isMale) {
            const wives = members.filter(m =>
                (m.familyRelationship === 'زوجة' || 'أخرى') &&
                m.husband?._id === selectedMember._id);

            const children = sortChildren(
                members.filter(m =>
                    (m.familyRelationship === 'ابن' || m.familyRelationship === 'ابنة') &&
                    m.parents?.father === selectedMember._id
                ));

            return {
                member: selectedMember,
                isMale,
                wives,
                children
            };
        } else {
            const husband = members.find(m => m._id === selectedMember.husband?._id);

            if (!husband) {
                const children = sortChildren(
                    members.filter(m =>
                        (m.familyRelationship === 'ابن' || m.familyRelationship === 'ابنة') &&
                        m.parents?.mother === selectedMember._id
                    ));

                return {
                    member: selectedMember,
                    isMale,
                    husband: null,
                    children
                };
            }

            const wives = members.filter(m =>
                (m.familyRelationship === 'زوجة' || 'أخرى') &&
                m.husband?._id === husband._id);

            const children = sortChildren(
                members.filter(m =>
                    (m.familyRelationship === 'ابن' || m.familyRelationship === 'ابنة') &&
                    (m.parents?.father === husband._id || m.parents?.mother === selectedMember._id)
                ));

            return {
                member: selectedMember,
                isMale,
                husband,
                wives,
                children
            };
        }

        function sortChildren(children: GetMembers[]) {
            return children.sort((a, b) => {
                if (a.gender === 'ذكر' && b.gender !== 'ذكر') return -1;
                if (a.gender !== 'ذكر' && b.gender === 'ذكر') return 1;
                return 0;
            });
        }
    }, [members, memberId]);

    const familyStats = useMemo(() => {
        if (!familyTree) return null;

        const grandChildren = familyTree.children.reduce((acc, child) => {
            const childrenOfChild = members.filter(m =>
                (m.parents?.father === child._id || m.parents?.mother === child._id)
            );
            return acc + childrenOfChild.length;
        }, 0);

        return {
            wives: familyTree.isMale ? familyTree.wives?.length || 0 : 0,
            sons: familyTree.children.filter(c => c.gender === 'ذكر').length,
            daughters: familyTree.children.filter(c => c.gender === 'أنثى').length,
            grandChildren
        };
    }, [familyTree, members]);

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
                    <ConnectionLine type="parent" />
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
                            <div className="absolute top-0 left-0 right-0 h-10 flex justify-center">
                                <ConnectionLine
                                    type="sibling"
                                    position={
                                        index === 0 ? 'first' :
                                            index === grandChildren.length - 1 ? 'last' :
                                                'middle'
                                    }
                                />
                            </div>

                            <div className="pt-6">
                                <FamilyNode
                                    member={grandChild}
                                    role={grandChild.familyRelationship === 'ابن' ? 'ابن' : 'ابنة'}
                                    className="hover:bg-green-50"
                                />
                            </div>
                        </motion.li>
                    ))}
                </ul>
            </div>
        );
    };

    if (!familyTree) {
        return (
            <div className="text-center py-4 text-gray-500">
                <p>لا يوجد بيانات للعضو المحدد</p>
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
                initialPositionX={250}
                wheel={{ step: 0.1 }}
                doubleClick={{ disabled: true }}
                limitToBounds={false}
            >
                {({ zoomIn, zoomOut, resetTransform }) => (
                    <>
                        <FamilyTreeControls
                            title={`${familyTree.member.fname} ${familyTree.member.lname}`}
                            subtitle={familyTree.isMale ? 'رب الأسرة' : 'زوجة'}
                            stats={familyStats || { wives: 0, sons: 0, daughters: 0, grandChildren: 0 }}
                            backLink={`/family-tree/${familyTree.member.familyBranch.name}`}
                            onZoomIn={zoomIn}
                            onZoomOut={zoomOut}
                            onReset={resetTransform}
                        />

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
                                <div className="relative mx-auto scrollbar-hide" style={{
                                    minWidth: 'max-content',
                                    maxWidth: '100%',
                                    transformOrigin: 'center top'
                                }}>
                                    <ul className="flex flex-col items-center space-y-4 scrollbar-hide">
                                        <motion.li className="text-center list-none mx-auto">
                                            {familyTree.isMale ? (
                                                <>
                                                    <FamilyNode
                                                        member={familyTree.member}
                                                        role="زوج"
                                                        isMain
                                                        isCurrent
                                                    >
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
                                                                            {familyTree.wives.length > 1 && (
                                                                                <div className="absolute top-0 left-0 -right-4 h-10 flex justify-center">
                                                                                    <ConnectionLine
                                                                                        type="sibling"
                                                                                        position={
                                                                                            index === 0 ? 'first' :
                                                                                                index === familyTree.wives.length - 1 ? 'last' :
                                                                                                    'middle'
                                                                                        }
                                                                                    />
                                                                                </div>
                                                                            )}
                                                                            <div className={`${familyTree.wives.length > 1 ? 'pt-6' : 'pt-0'}`}>
                                                                                <FamilyNode
                                                                                    member={wife}
                                                                                    role="زوجة"
                                                                                    className="hover:bg-purple-50"
                                                                                >
                                                                                    <ChildrenList
                                                                                        children={members.filter(m =>
                                                                                            (m.familyRelationship === 'ابن' || m.familyRelationship === 'ابنة') &&
                                                                                            m.parents?.father === familyTree.member._id &&
                                                                                            m.parents?.mother === wife._id
                                                                                        )}
                                                                                        parentId={familyTree.member._id}
                                                                                        motherId={wife._id}
                                                                                    />
                                                                                </FamilyNode>
                                                                            </div>
                                                                        </motion.li>
                                                                    ))}
                                                                </ul>
                                                            ) : (
                                                                <div className="flex justify-center">
                                                                    <AddButton text="إضافة زوجة" />
                                                                </div>
                                                            )}
                                                        </div>
                                                    </FamilyNode>
                                                </>
                                            ) : familyTree.husband ? (
                                                <>
                                                    <FamilyNode
                                                        member={familyTree.husband}
                                                        role="زوج"
                                                        isMain
                                                    >
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
                                                                            <div className="absolute top-0 left-0 -right-4 h-10 flex justify-center">
                                                                                <ConnectionLine
                                                                                    type="sibling"
                                                                                    position={
                                                                                        index === 0 ? 'first' :
                                                                                            index === familyTree.wives.length - 1 ? 'last' :
                                                                                                'middle'
                                                                                    }
                                                                                />
                                                                            </div>

                                                                            <div className={`${familyTree.wives.length > 1 ? 'pt-6' : 'pt-0'}`}>
                                                                                <FamilyNode
                                                                                    member={wife}
                                                                                    role="زوجة"
                                                                                    isCurrent={wife._id === familyTree.member._id}
                                                                                    className={wife._id === familyTree.member._id ?
                                                                                        'bg-purple-100 hover:bg-purple-200' :
                                                                                        'hover:bg-purple-50'
                                                                                    }
                                                                                >
                                                                                    <ChildrenList
                                                                                        children={members.filter(m =>
                                                                                            (m.familyRelationship === 'ابن' || m.familyRelationship === 'ابنة') &&
                                                                                            (m.parents?.father === familyTree.husband._id ||
                                                                                                m.parents?.mother === wife._id)
                                                                                        )}
                                                                                        parentId={familyTree.husband._id}
                                                                                        motherId={wife._id}
                                                                                    />
                                                                                </FamilyNode>
                                                                            </div>
                                                                        </motion.li>
                                                                    ))}
                                                                </ul>
                                                            ) : (
                                                                <div className="flex justify-center">
                                                                    <AddButton text="إضافة زوجة" />
                                                                </div>
                                                            )}
                                                        </div>
                                                    </FamilyNode>
                                                </>
                                            ) : (
                                                <>
                                                    <FamilyNode
                                                        member={familyTree.member}
                                                        role="زوجة"
                                                        isMain
                                                        isCurrent
                                                        className="bg-purple-100 hover:bg-purple-200"
                                                    >
                                                        <div className="relative pt-6">
                                                            {familyTree.children.length > 0 ? (
                                                                <ul className="flex flex-wrap justify-center gap-4">
                                                                    {familyTree.children.map((child, index) => (
                                                                        <motion.li
                                                                            key={child._id}
                                                                            className="relative"
                                                                            initial={{ opacity: 0, x: -10 }}
                                                                            animate={{ opacity: 1, x: 0 }}
                                                                            transition={{ duration: 0.3, delay: index * 0.1 }}
                                                                        >
                                                                            <div className="absolute top-0 left-0 -right-4 h-10 flex justify-center">
                                                                                <ConnectionLine
                                                                                    type="sibling"
                                                                                    position={
                                                                                        index === 0 ? 'first' :
                                                                                            index === familyTree.children.length - 1 ? 'last' :
                                                                                                'middle'
                                                                                    }
                                                                                />
                                                                            </div>

                                                                            <div className="pt-6">
                                                                                <FamilyNode
                                                                                    member={child}
                                                                                    role={child.familyRelationship === 'ابن' ? 'ابن' : 'ابنة'}
                                                                                    className="hover:bg-primary/10"
                                                                                >
                                                                                    {child._id && renderGrandChildren(child?._id)}
                                                                                </FamilyNode>
                                                                            </div>
                                                                        </motion.li>
                                                                    ))}
                                                                </ul>
                                                            ) : (
                                                                <div className="flex justify-center">
                                                                    <AddButton text="إضافة ابن/ابنة" />
                                                                </div>
                                                            )}
                                                        </div>
                                                    </FamilyNode>
                                                </>
                                            )}
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

export default ChildFamilyTree;