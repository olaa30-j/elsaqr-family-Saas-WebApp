import { useGetUserQuery } from "../../../store/api/usersApi";
import { useAppSelector } from "../../../store/store";
import { useState, useMemo } from "react";
import { Mail, Phone, Pencil, X, PencilIcon } from "lucide-react";
import SecuritySettings from "../../../components/dashboard/free/profile/SecuritySettings";
// import NotificationsSettings from "../../../components/dashboard/free/profile/NotificationsSettings";
import ActivitiesSettings from "../../../components/dashboard/free/profile/ActivitiesSettings";
import { Tabs } from "../../../components/ui/Tabs";
import { DEFAULT_IMAGE } from "../../../components/auth/RegisterationForm";
import ProfileForm from "../../../components/dashboard/free/profile/ProfileForm";
import { useGetMemberQuery, useUpdateMemberMutation } from "../../../store/api/memberApi";
import MemberForm from "../../../components/dashboard/free/members/MemberForm";
import type { User } from "../../../types/user";
import type { Member } from "../../../types/member";
import { toast } from "react-toastify";

interface ApiResponse<T> {
  data?: T;
  error?: {
    message: string;
  };
}

const ProfilePage = () => {
  const userData = useAppSelector((state) => state.auth.user) as User | null;
  const [isPEditing, setIsPEditing] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const userId = userData?._id || '';
  const memberId = userData?.memberId?._id || '';

  const {
    data: userResponse,
    isError: isUserError,
    isLoading: isUserLoading,
    error: userError,
    refetch: refetchUser
  } = useGetUserQuery(userId, {
    skip: !userId
  });

  const {
    data: memberResponse,
    isError: isMemberError,
    isLoading: isMemberLoading,
    error: memberError,
    refetch: refetchMember
  } = useGetMemberQuery(memberId, {
    skip: !memberId
  });

  const [updateMember, { isLoading: isUpdating }] = useUpdateMemberMutation();

  const refreshUserData = () => {
    refetchUser();
    refetchMember();
    setIsPEditing(false);
    setSelectedImage(null);
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);

      const formData = new FormData();
      formData.append('image', file);

      try {
        await updateMember({
          id: memberId,
          data: formData
        }).unwrap();

        toast.success("تم تحديث صورة العضو بنجاح");
        refreshUserData();
      } catch (error) {
        toast.error("فشل في تحديث الصورة");
        console.error(error);
      }
    }
  };

  const handleEditToggle = () => {
    setIsPEditing(!isPEditing);
    setSelectedImage(null);
  };

  const tabs = useMemo(() => {
    if (!userResponse || !memberResponse) return [];

    const user = userResponse.data || userResponse as User;
    const member = memberResponse.data || memberResponse as Member;

    const defaultValues = {
      fname: member.fname ?? '',
      lname: member.lname ?? '',
      familyBranch: member.familyBranch ?? 'الفرع الثالث',
      familyRelationship: member.familyRelationship ?? 'ابن',
      gender: member.gender ?? 'أنثى',
      birthday: member.birthday ?? null,
      deathDate: member.deathDate ?? null,
      father: member.parents?.father ?? '',
      mother: member.parents?.mother ?? '',
      husband: member.husband ?? '',
      wives: member.wives ?? [],
      children: member.children ?? [],
      image: member.image ?? null,
      summary: member.summary ?? ''
    };

    return [
      {
        id: 'profile',
        label: 'الملف الشخصي',
        content: (
          <div className="flex flex-col gap-8">
            <ProfileForm
              userId={user._id}
              defaultValues={user}
              onSuccess={() => refreshUserData()}
            />

            <MemberForm
              memberFormId={member._id}
              defaultValues={defaultValues}
              isEditing={true}
            />
          </div>
        ),
      },
      {
        id: 'security',
        label: 'الأمان',
        content: <SecuritySettings />,
      }
      // ,
      // {
      //   id: 'notifications',
      //   label: 'الإشعارات',
      //   content: <NotificationsSettings />,
      // }
      ,
      {
        id: 'activities',
        label: 'النشاطات',
        content: <ActivitiesSettings />,
      },
    ];
  }, [userResponse, memberResponse]);

  if (isUserLoading || isMemberLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <p>جارٍ تحميل البيانات...</p>
      </div>
    );
  }

  if (isUserError || isMemberError) {
    return (
      <div className="text-red-500 text-center p-4">
        <p>حدث خطأ في تحميل البيانات</p>
        {userError && <p>خطأ المستخدم: {'message' in userError ? userError.message : String(userError)}</p>}
        {memberError && <p>خطأ العضو: {'message' in memberError ? memberError.message : String(memberError)}</p>}
      </div>
    );
  }

  if (!userData || !userResponse || !memberResponse) {
    return (
      <div className="text-center p-4">
        <p>لا يوجد بيانات مستخدم</p>
      </div>
    );
  }

  const user = (userResponse as ApiResponse<User>).data || userResponse as User;
  const member = (memberResponse as ApiResponse<Member>).data || memberResponse as Member;

  return (
    <main className="flex-1 overflow-y-auto pb-16">
      <div className="container mx-auto px-4 py-4">
        {/* Profile Card */}
        <div className="rounded-lg border bg-accent/30 text-card-foreground shadow-sm mb-6 overflow-hidden">
          <div className="p-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Profile Image */}
              <div className="relative group">
                <label htmlFor="profileImage" className="cursor-pointer">
                  <span className="relative flex shrink-0 overflow-hidden rounded-full h-28 w-28 border-4 border-primary/80 shadow-lg transition-all duration-300 group-hover:border-primary group-hover:scale-105">
                    <img
                      className="aspect-square h-full w-full object-cover"
                      alt={`${user?.memberId?.fname || 'مستخدم'}`}
                      src={
                        selectedImage
                          ? URL.createObjectURL(selectedImage)
                          : member?.image || DEFAULT_IMAGE
                      }
                    />

                    {/* Overlay layer appears only in edit mode */}
                    {isPEditing && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-full transition-opacity duration-300">
                        <PencilIcon className="w-10 h-10 text-white" />
                      </div>
                    )}
                  </span>
                </label>

                {isPEditing && (
                  <input
                    id="profileImage"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    disabled={isUpdating}
                  />
                )}
              </div>

              {/* Profile Info */}
              <div className="text-center md:text-right flex-1 space-y-2">
                <div>
                  <h3 className="text-2xl font-bold tracking-tight text-gradient bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-primary">
                    {user?.memberId?.fname} {user?.memberId?.lname}
                  </h3>
                  <div className="flex items-center justify-center md:justify-start gap-2 mt-1">
                    {user?.role?.[0] && (
                      <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        {user.role[0]}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:gap-4 justify-center md:justify-start">
                  <div className="flex items-center justify-center gap-1.5 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span>{user?.email}</span>
                  </div>
                  <div className="flex items-center justify-center gap-1.5 text-muted-foreground">
                    <Phone className="h-4 w-4 mb-1 mx-1" />
                    <span>{user?.phone}</span>
                  </div>
                </div>

                {!isPEditing && (
                  <div className="pt-2 text-sm">
                    <p className="text-muted-foreground">
                      <span className="font-medium">العنوان:</span> {user?.address || "غير محدد"}
                    </p>
                    <p className="text-muted-foreground">
                      <span className="font-medium">الفرع:</span> {member.familyBranch || "غير محدد"}
                    </p>
                  </div>
                )}
              </div>

              {/* Edit Button */}
              <div className="md:ml-auto">
                <button
                  className="inline-flex items-center justify-center text-white gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-primary hover:bg-amber-500/80 h-10 px-4 py-2"
                  onClick={handleEditToggle}
                  disabled={isUpdating}
                >
                  {isUpdating ? (
                    <span>جاري التحديث...</span>
                  ) : isPEditing ? (
                    <>
                      <X className="h-4 w-4" />
                      إلغاء التعديل
                    </>
                  ) : (
                    <>
                      <Pencil className="h-4 w-4" />
                      تعديل صورتك الشخصية
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Page Tabs */}
        <Tabs tabs={tabs} queryParam="tab" />

        {/* Page Footer */}
        <footer className="py-4 border-t border-muted mt-8">
          <div className="text-center text-xs text-muted-foreground">
            <p>© {new Date().getFullYear()} عائلة الصقر الدهمش - جميع الحقوق محفوظة</p>
            <div className="flex justify-center gap-4 mt-1">
              <a href="/privacy" className="hover:text-primary transition-colors">
                سياسة الخصوصية
              </a>
              <a href="/terms" className="hover:text-primary transition-colors">
                شروط الاستخدام
              </a>
              <a href="/contact" className="hover:text-primary transition-colors">
                اتصل بالإدارة
              </a>
            </div>
            <p className="mt-1">الإصدار 1.0.0</p>
          </div>
        </footer>
      </div>
    </main>
  );
};

export default ProfilePage;