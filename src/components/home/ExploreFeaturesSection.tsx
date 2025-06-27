import { useState } from 'react';
import DetailsFeaturesCard from './reusable/DetailsFeaturesCard';
import featuresData from '../../../public/data/mainfeatures.json';
import * as LucideIcons from 'lucide-react';

const ExploreFeaturesSection = () => {
    const [activeTab, setActiveTab] = useState('family-tree');

    return (
        <section className="bg-gray-50" id='more'>
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground font-heading">
                        {featuresData.sectionTitle}
                    </h2>
                    <p className="text-lg text-color-2 max-w-2xl mx-auto ">
                        {featuresData.sectionDescription}
                    </p>
                </div>

                <div className="w-full">
                    <div className="w-full flex justify-center mb-8">
                        <div
                            role="tablist"
                            className="items-center justify-center rounded-md bg-color-2/10 p-1 text-color-2 grid grid-cols-2 md:grid-cols-4 max-w-2xl gap-1"
                        >
                            {featuresData.tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    type="button"
                                    role="tab"
                                    aria-selected={activeTab === tab.id}
                                    className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm font-medium transition-all px-3 py-2 text-sm ${activeTab === tab.id
                                            ? 'bg-white text-color-2 shadow-sm'
                                            : ''
                                        }`}
                                    onClick={() => setActiveTab(tab.id)}
                                >
                                    {tab.title}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mt-6">
                        {featuresData.tabs.map((tab) => (
                            <div
                                key={tab.id}
                                role="tabpanel"
                                hidden={activeTab !== tab.id}
                                className="mt-2"
                            >
                                {activeTab === tab.id && (
                                    <DetailsFeaturesCard
                                        key={tab.id}
                                        title={tab.content.title}
                                        description={tab.content.description}
                                        icon={tab.content.icon as keyof typeof LucideIcons}
                                        features={tab.content.features}
                                        image={tab.content.image}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ExploreFeaturesSection;