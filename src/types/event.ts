// types/event.ts
export interface IEvent {
  _id: string; // Converted to string for frontend
  userId: string; // Converted to string
  address: string;
  description: string;
  location: string;
  startDate: string; // Date as ISO string
  endDate: string; // Date as ISO string
  status?: 'active' | 'cancelled' | 'completed' | 'postponed';
  createdAt?: string; // Optional for display purposes
  updatedAt?: string; // Optional for display purposes
}

// For creating new events
export interface IEventInput {
  address: string;
  description: string;
  location: string;
  startDate: string; // ISO string format
  endDate: string; // ISO string format
  status?: string; // Optional status
}

// For updating events
export interface IEventUpdate {
  address?: string;
  description?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
}

// For API responses
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

// For event list props
export interface IEventListProps {
  events: IEvent[];
  loading: boolean;
  onEdit?: (event: IEvent) => void;
  onDelete?: (eventId: string) => void;
}

// For event form props
export interface IEventFormProps {
  initialData?: IEvent;
  onSubmit: (data: IEventInput | IEventUpdate) => void;
  loading: boolean;
  isUpdate?: boolean;
}