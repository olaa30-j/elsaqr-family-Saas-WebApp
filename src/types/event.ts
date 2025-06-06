export interface IEvent {
  _id: string;
  userId: string;
  address: string;
  description: string;
  location: string;
  startDate: any;
  endDate?: any;
  status?: 'active' | 'cancelled' | 'completed' | 'postponed';
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface IEventInput {
  address: string;
  description: string;
  startDate: any;
  location: string;
  endDate?: any;
  status?: string;
}

export interface IEventUpdate {
  address?: string;
  description?: string;
  location?: string;
  startDate?: any;
  endDate?: any;
  status?: string;
}

export interface IEventApiResponse {
  success: boolean;
  data: IEvent | IEvent[];
  message?: string;
  pagination?: {
    total: number;
    page: number;
    pages: number;
    limit: number;
  };
}

export interface IEventListProps {
  events: IEvent[];
  loading: boolean;
  onEdit?: (event: IEvent) => void;
  onDelete?: (eventId: string) => void;
}

export interface IEventFormProps {
  initialData?: IEvent;
  onSubmit: (data: IEventInput | IEventUpdate) => void;
  loading: boolean;
  isUpdate?: boolean;
}