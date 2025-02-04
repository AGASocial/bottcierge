import type { OrderStatus, OrderStatusType } from "../types/";

export const DEFAULT_VENUE_ID = "d6a2ed83-30d5-419c-ad3f-0e837d7fcb94";
export const DEFAULT_USER_ID = "42a65e28-323c-4147-a979-acc6fb10c20c";

export const ORDER_STATUS_COLORS: Record<OrderStatusType, string> = {
  draft: "bg-amber-500", // Warm yellow for draft
  paid: "bg-electric-blue", // Our custom electric blue for paid
  accepted: "bg-violet-500", // Purple for accepted
  preparing: "bg-light-blue", // Our custom light blue for preparing
  serving: "bg-orange-500", // Orange for active serving
  completed: "bg-emerald-500", // Bright green for completion
  cancelled: "bg-rose-500", // Red for cancelled
};

// Define the sequence of order statuses for display and flow
export const ORDER_STATUS_SEQUENCE = [
  "paid",
  "accepted",
  "preparing",
  "serving",
  "completed",
  "cancelled",
] as const;

// Terminal states that don't proceed to next status
export const TERMINAL_STATUSES: OrderStatusType[] = ["completed", "cancelled"];

export const getDayName = (dayNumber: number) => {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return days[dayNumber] || "Unknown";
};

export const formatTime = (timeString: string) => {
  const hours = parseInt(timeString.substring(0, 2));
  const minutes = timeString.substring(2);
  if (!hours || !minutes) return "";
  return new Date(0, 0, 0, hours, parseInt(minutes)).toLocaleTimeString(
    "en-US",
    {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }
  );
};

// You can add more order-related constants here in the future
