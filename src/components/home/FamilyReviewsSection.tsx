import ReviewCard from "./reusable/ReviewCard";
import testimonialsData from '../../../public/data/testimonials.json';

const FamilyReviewsSection = () => {
    return (
        <section>
            <div className="container mx-auto px-6">
                {/* عنوان القسم */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground font-heading">
                        {testimonialsData.sectionTitle}
                    </h2>
                    <p className="text-lg text-color-2 max-w-2xl mx-auto">
                        {testimonialsData.sectionDescription}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {testimonialsData.testimonials.map((testimonial, index) => (
                    <div key={index}>
                        <ReviewCard
                            key={testimonial.id}
                            quote={testimonial.quote}
                            name={testimonial.name}
                            role={testimonial.role}
                            avatar={testimonial.avatar}
                            rating={testimonial.rating}
                        />
                    </div>
                ))}
                </div>
            </div>
        </section>
    )
}

export default FamilyReviewsSection;