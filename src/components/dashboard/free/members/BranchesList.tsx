import BranchCard from "./BranchCard";

const BranchesList = () => {
    const branches = ['الفرع الأول', 'الفرع الثانى', 'الفرع الثالث', 'الفرع الرابع', 'الفرع الخامس'];

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">الأزواج في الفروع العائلية</h1>
            <div className="relative">
                <div className="overflow-x-auto pb-4 scrollbar-hide">
                    <div className="flex gap-6 w-max mx-auto px-4">
                        {branches.map(branch => (
                            <div key={branch} className="flex-shrink-0 w-72">
                                <BranchCard familyBranch={branch} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BranchesList;