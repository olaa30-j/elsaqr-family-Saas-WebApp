import type { FamilyFeature } from "../../../types/home";
import DetailsButton from "../../ui/DetailsButton";

interface featureProps {
    feature: FamilyFeature;
}

const FamilyFeaturesCard = ({feature}: featureProps) => {
    const renderSVG = (svgString: string) => {
        return (
            <span
                className="w-15 h-15 text-primary font-bold"
                dangerouslySetInnerHTML={{ __html: svgString }}
            />
        );
    };
    return (
        <div key={feature.id} className="h-full">
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm h-full overflow-hidden border-primary/10 relative group">
                <div className="absolute top-0 left-0 h-1 bg-gradient-to-r from-primary/80 to-amber-500/80 w-full"></div>

                <div className="p-8 flex flex-col items-center text-center">
                    <div className="mb-5 p-4 rounded-full bg-gradient-to-br from-primary/15 to-primary/5 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-full opacity-0 group-hover:opacity-100" style={{ transform: 'rotate(32.652deg)' }}></div>
                        <div className="relative z-10">
                            {renderSVG(feature.icon)}
                        </div>
                    </div>

                    <h3 className="text-xl font-bold mb-3 font-heading text-primary/90 font-cairo">
                        {feature.title}
                    </h3>
                    <p className="text-color-2 leading-relaxed">
                        {feature.description}
                    </p>

                    <DetailsButton buttonLink={""} children={"التفاصيل"}/>                        
                </div>
            </div>
        </div>
    )
}

export default FamilyFeaturesCard;

