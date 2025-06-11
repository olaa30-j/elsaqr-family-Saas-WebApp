export interface INotification {
  _id: string;
  message: string;
  action: "create" | "update" | "delete" | "view" | "approve" | "reject" | "reminder";
  entity: {
    type: "مناسبه" | "عضو" | "اعلان" | "ماليه" | "معرض الصور" | "مستخدم";
    id: string;
    name?: string;  
  };
  sender: {
    id: string;
    name: string;
    avatar?: string;
  };
  recipientId: string;
  readAt?: string | null;  
  read?: boolean;
  metadata?: {
    deepLink?: string;
    customData?: any;
    priority?: "low" | "medium" | "high";
  };
  status?: "pending" | "sent" | "delivered" | "failed";
  isMobileDelivered?: boolean;
  isEmailDelivered?: boolean;
  isWebDelivered?: boolean;
  createdAt?: string;  
  updatedAt?: string;  
  
  // Frontend specific properties (optional)
  isNew?: boolean;  
  isExpanded?: boolean; 
}

export interface INotificationListItem {
  _id: string;
  message: string;
  action: string;
  read: boolean;
  createdAt: string;
  sender: {
    name: string;
    avatar?: string;
  };
  isNew?: boolean;
}

export interface CreateNotificationDto {
  message: string;
  action: "create" | "update" | "delete" | "view" | "approve" | "reject" | "reminder";
  entity: {
    type: "مناسبه" | "عضو" | "اعلان" | "ماليه" | "معرض الصور" | "مستخدم";
    id: string;
  };
  recipientId: string;
  metadata?: {
    deepLink?: string;
    customData?: any;
    priority?: "low" | "medium" | "high";
  };
}