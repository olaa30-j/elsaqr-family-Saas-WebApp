import type { AdvertisementType } from "../../../../types/advertisement";

type AdvertisementTypeBadgeProps = {
    type: AdvertisementType;
};

const AdvertisementTypeBadge = ({ type }: AdvertisementTypeBadgeProps) => {
    const typeConfig = {
        important: { color: "bg-red-100 text-red-800", text: "مهم" },
        general: { color: "bg-blue-100 text-blue-800", text: "عام" },
        social: { color: "bg-green-100 text-green-800", text: "اجتماعي" }
    };

    return (
        <span className={`px-2 py-1 text-xs font-semibold rounded-md ${typeConfig[type].color}`}>
            {typeConfig[type].text}
        </span>
    );
};

export default AdvertisementTypeBadge;