import React from 'react';
import { motion } from 'framer-motion';
import { formatArabicDate } from '../../../../utils/utils';
import type { Member } from '../../../../types/member';

interface FamilyMemberNodeProps {
    member: Member | null;
    role: string;
    onClick: (member: Member) => void;
    isRoot?: boolean;
}

const FamilyMemberNode: React.FC<FamilyMemberNodeProps> = ({
    member,
    role,
    onClick,
    isRoot = false
}) => {
    return (
        <>
            {member
                && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`member-node ${isRoot ? 'root-node' : ''}`}
                        onClick={() => onClick(member)}
                    >
                        <div className="member-avatar">
                            {member.image ? (
                                <img src={member.image} alt={`${member.fname} ${member.lname}`} />
                            ) : (
                                <div className="avatar-placeholder">
                                    {role === 'زوج' || role === 'ابن' ? '👨' : '👩'}
                                </div>
                            )}
                        </div>

                        <div className="member-info">
                            <h3 className="member-name">
                                {member.fname} {member.lname}
                                <span className="member-role">{role}</span>
                            </h3>

                            <div className="member-dates">
                                <p>الميلاد: {formatArabicDate(member.birthday)}</p>
                                {member.deathDate && (
                                    <p>الوفاة: {formatArabicDate(member.deathDate)}</p>
                                )}
                            </div>
                        </div>

                        {isRoot && <div className="connection-line root-line" />}
                    </motion.div>
                )
            }
        </>
    );
};

export default FamilyMemberNode;