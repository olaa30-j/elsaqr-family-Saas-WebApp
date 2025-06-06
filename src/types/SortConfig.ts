// types/table.ts
export interface SortConfig<T> {
    key: keyof T;
    direction: 'asc' | 'desc';
}