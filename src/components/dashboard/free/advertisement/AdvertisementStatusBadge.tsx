import type { AdvertisementStatus } from "../../../../types/advertisement";

type AdvertisementStatusBadgeProps = {
    status: AdvertisementStatus;
};

const AdvertisementStatusBadge = ({ status }: AdvertisementStatusBadgeProps) => {
    const statusConfig = {
        pending: { color: "bg-yellow-100 text-yellow-800", text: "قيد الانتظار" },
        accept: { color: "bg-green-100 text-green-800", text: "مقبول" },
        reject: { color: "bg-red-100 text-red-800", text: "مرفوض" }
    };

    return (
        <span className={`px-2 py-1 text-xs font-semibold rounded-md ${statusConfig[status].color}`}>
            {statusConfig[status].text}
        </span>
    );
};

export default AdvertisementStatusBadge;