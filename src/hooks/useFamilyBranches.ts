import { useGetAllBranchesQuery } from '../store/api/branchApi';

export const useFamilyBranches = () => {
  const { data: getAllBranches } = useGetAllBranchesQuery({ page: 1, limit: 30 });
  
  const familyBranches = getAllBranches?.data.map((branch: any) => ({
    value: branch._id,
    label: branch.name
  })) || [];

  return { familyBranches, isLoading: !getAllBranches };
};