import { useParams } from 'react-router-dom';
import FamilyTree from '../../../components/dashboard/free/members/FamilyTree'

const FamilyTreePage = () => {
    const { branch } = useParams<{ branch: string }>();

    return (
        <section className='-mt-20'>
            <FamilyTree familyBranch={branch || ''} />
        </section>
    )
}

export default FamilyTreePage