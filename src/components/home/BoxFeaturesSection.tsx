import familyFeatures from '../../../public/data/familyfreature.json'
import FamilyFeaturesCard from './reusable/FamilyFeaturesCard'

const BoxFeaturesSection = () => {
    return (
        <section className="container px-8" id="explore">
            <div className="text-center mb-16">
                {/* Badge/Tag */}
                <span
                    className="block w-fit text-center mx-auto text-sm font-semibold text-primary px-4 py-1.5 rounded-full bg-primary/10 mb-4"
                >
                    ✨ مميزات فريدة
                </span>

                {/* Title with underline */}
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground font-heading relative inline-block">
                    <span className="relative">
                        مميزات تطبيق صندوق العائلة
                        <span
                            className="absolute -bottom-2 left-0 right-0 h-1 bg-primary/30 rounded-full md:w-full w-[80vw]"
                        ></span>
                    </span>
                </h2>

                {/* Description */}
                <p className="text-lg text-color-2 max-w-2xl mx-auto">
                    مجموعة من الأدوات المتكاملة لتعزيز الترابط العائلي وتسهيل التواصل وإدارة شؤون العائلة
                </p>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                {familyFeatures.map((features, index) => (
                    <div key={index}>
                        <FamilyFeaturesCard feature={features} />
                    </div>
                ))}
            </div>
        </section>
    )
}

export default BoxFeaturesSection