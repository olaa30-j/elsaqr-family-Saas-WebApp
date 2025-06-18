import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { BaseForm } from '../../../shared/BaseForm';
import { memberSchema } from '../../../../types/schemas';
import { useParams } from 'react-router-dom';
import {
    useCreateMemberMutation,
    useUpdateMemberMutation,
    useGetMembersQuery
} from '../../../../store/api/memberApi';
import type { GetMembers } from '../../../../types/member';
import { familyRelationships } from '../../../../types/user';

type FamilyBranchType = "الفرع الخامس" | "الفرع الرابع" | "الفرع الثالث" | "الفرع الثاني" | "الفرع الاول";

interface MemberFormProps {
    memberFormId?: string;
    defaultValues?: any;
    onSuccess?: () => void;
    onCancel?: () => void;
    isEditing?: boolean;
}

const MemberForm: React.FC<MemberFormProps> = ({
    memberFormId,
    defaultValues,
    onSuccess,
    onCancel,
    isEditing = false,
}) => {
    const [familyBranch, setFamilyBranch] = useState<FamilyBranchType | ''>(defaultValues?.familyBranch || "");
    const [filteredMembers, setFilteredMembers] = useState<GetMembers[]>([]);
    const [maleMembers, setMaleMembers] = useState<GetMembers[]>([]);
    const [femaleMembers, setFemaleMembers] = useState<GetMembers[]>([]);
    const [parentOptions, setParentOptions] = useState<GetMembers[]>([]);
    const [hasSpouse, setHasSpouse] = useState<boolean>(false);
    const [hasChildren, setHasChildren] = useState<boolean>(false);
    const [selectedWives, setSelectedWives] = useState<string[]>([]);
    const [selectedChildren, setSelectedChildren] = useState<string[]>([]);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [selectedImage, setSelectedImage] = useState<any>();
    const [birthdayInput, setBirthdayInput] = useState('');
    const [deathDateInput, setDeathDateInput] = useState('');


    const { data: membersData } = useGetMembersQuery({
        page: 1,
        limit: 200,
        familyBranch: familyBranch || undefined
    });

    let memberID = memberFormId;
    if (!memberID) {
        const { memberId } = useParams<{ memberId: string }>();
        memberID = memberId;
    }

    const [createMember] = useCreateMemberMutation();
    const [updateMember] = useUpdateMemberMutation();

    useEffect(() => {
        if (membersData?.data) {
            const filtered = familyBranch
                ? membersData.data.filter(m => m.familyBranch === familyBranch)
                : membersData.data;

            setFilteredMembers(filtered);

            const males = filtered.filter(m =>
                m.gender === 'ذكر' &&
                ['زوج', 'ابن', 'أخرى'].includes(m.familyRelationship)
            );

            const females = filtered.filter(m =>
                m.gender === 'أنثى' &&
                ['زوجة', 'ابنة', 'أخرى'].includes(m.familyRelationship)
            );

            const parents = filtered.filter(m => {
                return !defaultValues?.birthday || !m?.birthday ||
                    new Date(m.birthday) < new Date(defaultValues.birthday);
            });

            setMaleMembers(males);
            setFemaleMembers(females);
            setParentOptions(parents);

            if (defaultValues) {
                const spouseExists = (isEditing && defaultValues.gender === 'ذكر')
                    ? defaultValues.wives?.length > 0
                    : (defaultValues.gender === 'ذكر' && defaultValues.wives?.length > 0) ||
                    (defaultValues.gender === 'أنثى' && defaultValues.husband);

                const childrenExist = defaultValues.children?.length > 0;

                setHasSpouse(spouseExists);
                setHasChildren(childrenExist);
            }

            if (defaultValues?.wives) {
                const initialWives = Array.isArray(defaultValues.wives)
                    ? defaultValues.wives.map((w: any) => getIdFromValue(w))
                    : [];
                setSelectedWives(initialWives);
            }

            if (defaultValues?.children) {
                const initialChildren = Array.isArray(defaultValues.children)
                    ? defaultValues.children.map((c: any) => getIdFromValue(c))
                    : [];
                setSelectedChildren(initialChildren);
            }

            if (defaultValues?.image) {
                setImagePreview(defaultValues.image);
            }

            if (defaultValues?.birthday) {
                const date = new Date(defaultValues.birthday);
                setBirthdayInput(date.toISOString().split('T')[0]);
            }

            if (defaultValues?.deathDate) {
                const date = new Date(defaultValues.deathDate);
                setDeathDateInput(date.toISOString().split('T')[0]);
            }


        }
    }, [membersData, familyBranch, defaultValues, isEditing]);

    const handleSubmit = async (data: any) => {
        parentOptions
        try {
            const formData = new FormData();
            const prepareData = (key: string, value: any) => {
                if (value === null || value === undefined || value === '') return;

                else if (key === 'wives') {
                    selectedWives.forEach((wifeId, i) => {
                        formData.append(`wives[${i}]`, wifeId);
                    });
                }
                else if (key === 'children') {
                    selectedChildren.forEach((childrenId, i) => {
                        formData.append(`children[${i}]`, childrenId);
                    });
                } else if (typeof value === 'object' && value._id) {
                    formData.append(key, value._id);
                }
                else {
                    formData.append(key, String(value));
                }
            };

            if (data.parents) {
                prepareData('parents[father]', data.parents.father);
                prepareData('parents[mother]', data.parents.mother);
            }

            Object.entries(data).forEach(([key, value]) => {

                if (selectedImage && key === 'image') {
                    formData.append('image', selectedImage);
                }
                else if (key !== 'parents' && key !== 'image') {
                    prepareData(key, value);
                }
            });

            if (isEditing && memberID) {
                await updateMember({ id: memberID, data: formData }).unwrap();
                toast.success("تم تحديث العضو بنجاح");
            } else {
                await createMember(formData).unwrap();
                toast.success("تم إضافة العضو بنجاح");
            }

            onSuccess?.();
        } catch (error: any) {
            toast.error(error.data?.message || "حدث خطأ");
        }
    };

    const getIdFromValue = (value: any): string => {
        if (!value) return '';
        return typeof value === 'object' ? value._id : value;
    };

    const handleFamilyBranchChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value as FamilyBranchType | '';
        setFamilyBranch(value);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedImage(file);

            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);

        }
    };


    return (
        <BaseForm
            schema={memberSchema}
            defaultValues={defaultValues}
            onSubmit={handleSubmit}
            onCancel={onCancel}
            isEditing={isEditing}
            formTitle={isEditing ? 'تعديل بيانات العضو' : 'إضافة عضو جديد'}
        >
            {({ register, formState: { errors }, watch, setValue }) => {
                const gender = watch('gender');
                const relationship = watch('familyRelationship');
                const isMale = gender === 'ذكر';
                const isFemale = gender === 'أنثى';
                const isChild = ['ابن', 'ابنة'].includes(relationship);

                return (
                    <div className="space-y-6">
                        {/* Basic Information Section */}
                        <div className="bg-white p-4 rounded-lg shadow">
                            <h3 className="text-lg font-medium mb-4 border-b pb-2">المعلومات الأساسية</h3>
                            {/* Image */}
                            <div className="space-y-1 md:col-span-2 flex items-end gap-6">
                                {/* معاينة الصورة */}
                                {imagePreview && (
                                    <div className="mb-3">
                                        <img
                                            src={imagePreview}
                                            alt="معاينة الصورة"
                                            className="h-32 w-32 object-cover rounded-md border"
                                        />
                                    </div>
                                )}

                                <input
                                    type="file"
                                    accept="image/*"
                                    {...register('image')}
                                    onChange={handleImageChange}
                                    className="block w-full  text-sm text-gray-500 file:ml-4 file:py-2 file:my-4 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary/5 file:text-primary hover:file:text-white hover:file:bg-primary "
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* First Name */}
                                <div className="space-y-1">
                                    <label className="block text-sm font-medium text-gray-700">
                                        الاسم الاول <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        {...register('fname')}
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                                    />
                                    {errors.fname && (
                                        <p className="mt-1 text-sm text-red-600">{errors.fname.message}</p>
                                    )}
                                </div>

                                {/* Last Name */}
                                <div className="space-y-1">
                                    <label className="block text-sm font-medium text-gray-700">
                                        الاسم الأخير <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        {...register('lname')}
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                                    />
                                    {errors.lname && (
                                        <p className="mt-1 text-sm text-red-600">{errors.lname.message}</p>
                                    )}
                                </div>

                                {/* Family Branch */}
                                <div className="space-y-1">
                                    <label className="block text-sm font-medium text-gray-700">
                                        الفرع العائلي <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        {...register('familyBranch')}
                                        onChange={handleFamilyBranchChange}
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                                    >
                                        <option value="">اختر الفرع</option>
                                        {(['الفرع الاول', 'الفرع الثاني', 'الفرع الثالث', 'الفرع الرابع', 'الفرع الخامس'] as FamilyBranchType[]).map(b => (
                                            <option key={b} value={b}>{b}</option>
                                        ))}
                                    </select>
                                    {errors.familyBranch && (
                                        <p className="mt-1 text-sm text-red-600">{errors.familyBranch.message}</p>
                                    )}
                                </div>

                                {/* Relationship */}
                                <div className="space-y-1">
                                    <label className="block text-sm font-medium text-gray-700">
                                        صلة القرابة <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        {...register('familyRelationship')}
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                                    >
                                        <option value="">اختر الصلة</option>
                                        {familyRelationships.map((relation) => (
                                            <option key={relation.value} value={relation.value}>
                                                {relation.label === "الجد الأعلى" ? `${relation.label} (رأس الأسرة)` : relation.label}
                                            </option>
                                        ))}                
                                    </select>
                                    {errors.familyRelationship && (
                                        <p className="mt-1 text-sm text-red-600">{errors.familyRelationship.message}</p>
                                    )}
                                </div>

                                {/* Gender */}
                                <div className="space-y-1">
                                    <label className="block text-sm font-medium text-gray-700">
                                        الجنس <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        {...register('gender')}
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                                    >
                                        <option value="">اختر الجنس</option>
                                        <option value="ذكر">ذكر</option>
                                        <option value="أنثى">أنثى</option>
                                    </select>
                                    {errors.gender && (
                                        <p className="mt-1 text-sm text-red-600">{errors.gender.message}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Family Relationships Section */}
                        {(isFemale && relationship === 'زوجة') ||
                            (isMale && (relationship === 'زوج' || relationship === 'ابن')) ||
                            (isChild) ? (
                            <div className="bg-white p-4 rounded-lg shadow">
                                <h3 className="text-lg font-medium mb-4 border-b pb-2">العلاقات العائلية</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {isFemale && relationship === 'زوجة' && (
                                        <div className="space-y-1">
                                            <label className="block text-sm font-medium text-gray-700">
                                                الزوج <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                {...register('husband')}
                                                disabled={maleMembers.length === 0}
                                                defaultValue={
                                                    defaultValues?.husband._id ||
                                                    defaultValues?.husband ||
                                                    ''
                                                }
                                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border disabled:bg-gray-100"
                                            >
                                                <option value="">اختر الزوج</option>
                                                {maleMembers.map(m => {
                                                    const currentHusbandId = getIdFromValue(defaultValues?.husband._id || defaultValues?.husband);
                                                    const isCurrentHusband = currentHusbandId === m._id;

                                                    return (
                                                        <option
                                                            key={m._id}
                                                            value={m._id}
                                                            selected={isCurrentHusband}
                                                            className={isCurrentHusband ? "bg-blue-100 font-medium" : ""}
                                                            style={isCurrentHusband ? {
                                                                backgroundColor: '#ebf5ff',
                                                                fontWeight: '500'
                                                            } : {}}
                                                        >
                                                            {m.fname} {m.lname}
                                                            {isCurrentHusband && " (زوج حالى)"}
                                                        </option>
                                                    );
                                                })}
                                            </select>
                                            {maleMembers.length === 0 && (
                                                <p className="mt-1 text-sm text-yellow-600">لا يوجد أزواج في هذا الفرع</p>
                                            )}
                                            {errors.husband && (
                                                <p className="mt-1 text-sm text-red-600">{errors.husband.message}</p>
                                            )}
                                        </div>
                                    )}
                                    {/* Wives (for husbands) */}
                                    {isMale && (relationship === 'ابن' || relationship === 'زوج') && (
                                        <>
                                            <div className="space-y-1">
                                                <label className="block text-sm font-medium text-gray-700">
                                                    هل لديك زوجة؟
                                                </label>
                                                <div className="flex space-x-4">
                                                    <label className="inline-flex items-center">
                                                        <input
                                                            type="radio"
                                                            name="hasSpouse"
                                                            checked={hasSpouse}
                                                            onChange={() => setHasSpouse(true)}
                                                            className="form-radio h-4 w-4 text-blue-600"
                                                        />
                                                        <span className="mx-2 text-sm text-gray-700">نعم</span>
                                                    </label>
                                                    <label className="inline-flex items-center">
                                                        <input
                                                            type="radio"
                                                            name="hasSpouse"
                                                            checked={!hasSpouse}
                                                            onChange={() => setHasSpouse(false)}
                                                            className="form-radio h-4 w-4 text-blue-600"
                                                        />
                                                        <span className="mx-2 text-sm text-gray-700">لا</span>
                                                    </label>
                                                </div>
                                            </div>

                                            {hasSpouse && (
                                                <div className="space-y-1">
                                                    <label className="block text-sm font-medium text-gray-700">
                                                        الزوجات
                                                    </label>
                                                    <select
                                                        multiple
                                                        disabled={femaleMembers.length === 0}
                                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border disabled:bg-gray-100"
                                                        value={selectedWives}
                                                        onChange={(e) => {
                                                            const options = e.target.options;
                                                            const newSelectedWives: string[] = [];
                                                            for (let i = 0; i < options.length; i++) {
                                                                if (options[i].selected) {
                                                                    newSelectedWives.push(options[i].value);
                                                                }
                                                            }
                                                            setSelectedWives(newSelectedWives);
                                                        }}
                                                    >
                                                        {femaleMembers.map(m => (
                                                            <option key={m._id} value={m._id}>
                                                                {m.fname} {m.lname}
                                                            </option>
                                                        ))}
                                                    </select>


                                                    {/* عرض الزوجات المختارة */}
                                                    <div className="flex flex-wrap gap-2 mt-2">
                                                        {selectedWives.map((wifeId: any) => {
                                                            const wife = femaleMembers.find(m => m._id === wifeId);
                                                            if (!wife) return null;

                                                            return (
                                                                <div key={wife._id} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm flex items-center">
                                                                    {wife.fname} {wife.lname}
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => {
                                                                            const currentWives = watch('wives') || [];
                                                                            const newWives = currentWives.filter((id: any) => id !== wife._id);
                                                                            setValue('wives', newWives);
                                                                        }}
                                                                        className="mr-1 text-blue-600 hover:text-blue-800"
                                                                    >
                                                                        &times;
                                                                    </button>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>

                                                    <p className="mt-1 text-xs text-gray-500">
                                                        يمكن اختيار أكثر من زوجة (بحد أقصى 4) - اضغط على (Ctrl + Click) لتحديد أكثر من زوجة
                                                    </p>
                                                    {errors.wives && (
                                                        <p className="mt-1 text-sm text-red-600">{errors.wives.message}</p>
                                                    )}
                                                </div>)}
                                        </>
                                    )}
                                    {/* Parents (for children) */}
                                    {(isChild) && (
                                        <>
                                            <div className="space-y-1">
                                                <label className="block text-sm font-medium text-gray-700">
                                                    الأب
                                                </label>
                                                <select
                                                    {...register('parents.father')}
                                                    defaultValue={getIdFromValue(defaultValues?.parents?.father) || ''}
                                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                                                >
                                                    <option value="">اختر الأب</option>
                                                    {maleMembers.map(m => {
                                                        const currentFatherId = getIdFromValue(defaultValues?.parents?.father._id);
                                                        const isCurrentFather = currentFatherId === m._id;

                                                        return (
                                                            <option
                                                                key={m._id}
                                                                value={m._id}
                                                                selected={isCurrentFather}
                                                                className={isCurrentFather ? "bg-blue-100 font-medium" : ""}
                                                                style={isCurrentFather ? {
                                                                    backgroundColor: '#ebf5ff',
                                                                    fontWeight: '500'
                                                                } : {}}
                                                            >
                                                                {m.fname} {m.lname}
                                                                {isCurrentFather && " (أب حالى)"}
                                                            </option>
                                                        );
                                                    })}
                                                </select>
                                            </div>

                                            <div className="space-y-1">
                                                <label className="block text-sm font-medium text-gray-700">
                                                    الأم
                                                </label>
                                                <select
                                                    {...register('parents.mother')}
                                                    defaultValue={
                                                        defaultValues?.parents?.mother?._id ||
                                                        defaultValues?.parents?.mother ||
                                                        ''
                                                    }
                                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                                                >
                                                    <option value="">اختر الأم</option>
                                                    {femaleMembers.map(m => {
                                                        const currentMotherId = defaultValues?.parents?.mother?._id || defaultValues?.parents?.mother;
                                                        const isCurrentMother = currentMotherId === m._id;

                                                        return (
                                                            <option
                                                                key={m._id}
                                                                value={m._id}
                                                                selected={isCurrentMother}
                                                                className={isCurrentMother ? "bg-blue-100 font-medium" : ""}
                                                                style={isCurrentMother ? { backgroundColor: '#ebf5ff' } : {}}
                                                            >
                                                                {m.fname} {m.lname}
                                                                {isCurrentMother && " (أم حالية)"}
                                                            </option>
                                                        );
                                                    })}
                                                </select>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        ) : null}

                        {/* Children Section */}
                        {(isMale || isFemale) && (relationship === 'زوج' || relationship === 'زوجة' || isChild) && (
                            <div className="bg-white p-4 rounded-lg shadow">
                                <h3 className="text-lg font-medium mb-4 border-b pb-2">الأبناء</h3>
                                <div className="grid grid-cols-1 gap-4">
                                    <div className="space-y-1">
                                        <label className="block text-sm font-medium text-gray-700">
                                            هل لديك أبناء؟
                                        </label>
                                        <div className="flex space-x-4">
                                            <label className="inline-flex items-center">
                                                <input
                                                    type="radio"
                                                    name="hasChildren"
                                                    checked={hasChildren}
                                                    onChange={() => setHasChildren(true)}
                                                    className="form-radio h-4 w-4 text-blue-600"
                                                />
                                                <span className="mx-2 text-sm text-gray-700">نعم</span>
                                            </label>
                                            <label className="inline-flex items-center">
                                                <input
                                                    type="radio"
                                                    name="hasChildren"
                                                    checked={!hasChildren}
                                                    onChange={() => setHasChildren(false)}
                                                    className="form-radio h-4 w-4 text-blue-600"
                                                />
                                                <span className="mx-2 text-sm text-gray-700">لا</span>
                                            </label>
                                        </div>
                                    </div>

                                    {hasChildren && (
                                        <div className="space-y-1">
                                            <label className="block text-sm font-medium text-gray-700">
                                                الأبناء
                                            </label>

                                            <select
                                                multiple
                                                disabled={filteredMembers.length === 0}
                                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border disabled:bg-gray-100"
                                                value={selectedChildren}
                                                onChange={(e) => {
                                                    const options = e.target.options;
                                                    const newSelectedChildren: string[] = [];
                                                    for (let i = 0; i < options.length; i++) {
                                                        if (options[i].selected) {
                                                            newSelectedChildren.push(options[i].value);
                                                        }
                                                    }
                                                    setSelectedChildren(newSelectedChildren);
                                                    setValue('children', newSelectedChildren);
                                                }}
                                            >
                                                {filteredMembers
                                                    .filter(m => ['ابن', 'ابنة'].includes(m.familyRelationship))
                                                    .map(m => (
                                                        <option key={m._id} value={m._id}>
                                                            {m.fname} {m.lname} ({m.familyRelationship})
                                                        </option>
                                                    ))}
                                            </select>

                                            {/* عرض الأبناء المختارين */}
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {selectedChildren.map(childId => {
                                                    const child = filteredMembers.find(m => m._id === childId);
                                                    if (!child) return null;

                                                    return (
                                                        <div key={child._id} className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm flex items-center">
                                                            {child.fname} {child.lname} ({child.familyRelationship})
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    const updatedChildren = selectedChildren.filter(id => id !== child._id);
                                                                    setSelectedChildren(updatedChildren);
                                                                }}
                                                                className="ml-1 text-green-600 hover:text-green-800"
                                                            >
                                                                &times;
                                                            </button>
                                                        </div>
                                                    );
                                                })}
                                            </div>

                                            <p className="mt-1 text-xs text-gray-500">يمكن اختيار أكثر من ابن</p>
                                            {errors.children && (
                                                <p className="mt-1 text-sm text-red-600">{errors.children.message}</p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Additional Information Section */}
                        <div className="bg-white p-4 rounded-lg shadow">
                            <h3 className="text-lg font-medium mb-4 border-b pb-2">معلومات إضافية</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Birthday */}
                                <div className="space-y-1">
                                    <label className="block text-sm font-medium text-gray-700">
                                        تاريخ الميلاد
                                    </label>
                                    <input
                                        type="date"
                                        {...register('birthday')}
                                        value={birthdayInput}
                                        onChange={(e) => setBirthdayInput(e.target.value)}
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                                    />
                                    {errors.birthday && (
                                        <p className="mt-1 text-sm text-red-600">{errors.birthday.message}</p>
                                    )}
                                </div>

                                {/* Death Date */}
                                <div className="space-y-1">
                                    <label className="block text-sm font-medium text-gray-700">
                                        تاريخ الوفاة (إن وجد)
                                    </label>
                                    <input
                                        type="date"
                                        {...register('deathDate')}
                                        value={deathDateInput}
                                        onChange={(e) => setDeathDateInput(e.target.value)}
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                                    />
                                    {errors.deathDate && (
                                        <p className="mt-1 text-sm text-red-600">{errors.deathDate.message}</p>
                                    )}
                                </div>

                                {/* Summary */}
                                <div className="space-y-1 md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        ملخص عن العضو
                                    </label>
                                    <textarea
                                        {...register('summary')}
                                        rows={3}
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                                    />
                                    {errors.summary && (
                                        <p className="mt-1 text-sm text-red-600">{errors.summary.message}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            }}
        </BaseForm>
    );
};

export default MemberForm;