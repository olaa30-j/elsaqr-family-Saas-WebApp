import Button from "../ui/Button"

const JoinFamilySection = () => {
    return (
        <section className="bg-gradient-to-b from-primary/10 to-background">
            <div className="max-w-3xl mx-auto text-center">
                <h1 className="font-cairo text-responsive-2xl">
                    انضم إلى عائلتنا في العالم الرقمي
                </h1>

                <p className="text-responsive-lg text-color-2 mt-4 mb-8">
                    تطبيق صندوق العائلة يتيح لك البقاء على تواصل دائم مع أفراد العائلة، ومتابعة آخر الأخبار والفعاليات، والمشاركة في الأنشطة المختلفة.
                </p>

                <Button
                    buttonLink="/login"
                    variant="primary"
                >
                    سجل دخولك الآن
                </Button>
            </div>
        </section>
    )
}

export default JoinFamilySection