import React, { useEffect } from 'react';
import {
  useForm,
  FormProvider,
  type UseFormProps,
  type SubmitHandler,
  type UseFormReturn,
  type UseFormRegister,
  type UseFormSetValue
} from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';

interface BaseFormProps<T extends yup.AnyObjectSchema> {
  schema: T;
  defaultValues?: UseFormProps<yup.InferType<T>>['defaultValues'];
  onSubmit: SubmitHandler<yup.InferType<T>>;
  onCancel?: () => void;
  isEditing?: boolean;
  children: (methods: {
    register: UseFormRegister<yup.InferType<T>>;
    formState: UseFormReturn<yup.InferType<T>>['formState'];
    watch: UseFormReturn<yup.InferType<T>>['watch'];
    control: UseFormReturn<yup.InferType<T>>['control'];
    setValue: UseFormSetValue<yup.InferType<T>>;
  }) => React.ReactNode;
  formTitle?: string;
  formDescription?: string;
}

export function BaseForm<T extends yup.AnyObjectSchema>({
  schema,
  defaultValues,
  onSubmit,
  onCancel,
  isEditing = false,
  children,
  formTitle,
  formDescription,
}: BaseFormProps<T>) {
  const methods = useForm<yup.InferType<T>>({
    resolver: yupResolver(schema),
    defaultValues,
  });

  useEffect(() => {
    if (defaultValues) {
      methods.reset(defaultValues);
    }
  }, [defaultValues, methods]);

  const handleSubmit = async (data: yup.InferType<T>) => { 
    try {
      await onSubmit(data);
      methods.reset(data);
    } catch (error) {
      toast.error("حدث خطأ، يرجى المحاولة مرة أخرى");
      console.error(error);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(handleSubmit)}>
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          {(formTitle || formDescription) && (
            <div className="flex flex-col space-y-1.5 p-6">
              {formTitle && (
                <div className="text-2xl font-semibold leading-none tracking-tight">
                  {formTitle}
                </div>
              )}
              {formDescription && (
                <div className="text-sm text-muted-foreground">
                  {formDescription}
                </div>
              )}
            </div>
          )}

          <div className="p-6 pt-0 space-y-4">
            {children({
              register: methods.register,
              formState: methods.formState,
              watch: methods.watch,
              control: methods.control,
              setValue: methods.setValue
            })}
          </div>

          <div className="flex items-center justify-end gap-2 p-6 pt-0">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
              >
                إلغاء
              </button>
            )}
            <button
              type="submit"
              disabled={methods.formState.isSubmitting}
              className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-white hover:bg-primary/90 h-10 px-4 py-2 ${
                methods.formState.isSubmitting ? 'opacity-50' : ''
              }`}
            >
              {methods.formState.isSubmitting 
                ? 'جاري الحفظ...' 
                : isEditing 
                  ? 'حفظ التغييرات' 
                  : 'حفظ'}
            </button>
          </div>
        </div>
      </form>
    </FormProvider>
  );
}