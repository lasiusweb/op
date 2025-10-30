import React from 'react';
import { SparklesIcon, RectangleGroupIcon, DocumentChartBarIcon, UserGroupIcon } from '../components/Icons';

interface LandingPageProps {
    onLogin: () => void;
}

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
    <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50">
        <div className="flex items-center gap-4 mb-3">
            <div className="bg-teal-500/10 p-2 rounded-lg text-teal-400">
                {icon}
            </div>
            <h3 className="text-xl font-bold text-white">{title}</h3>
        </div>
        <p className="text-gray-400">{children}</p>
    </div>
);

const LandingPage: React.FC<LandingPageProps> = ({ onLogin }) => {
    return (
        <div className="bg-gray-900 text-gray-200 min-h-screen font-sans">
            <div 
                className="relative min-h-screen flex items-center justify-center text-center p-8 bg-cover bg-center"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1627852359419-755e10fcfd15?q=80&w=2532&auto=format&fit=crop')" }}
            >
                <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm"></div>
                <main className="relative z-10 max-w-4xl mx-auto">
                    <div className="flex justify-center items-center gap-4 mb-6">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2h1a2 2 0 002-2v-1a2 2 0 012-2h1.945M12 4v7m0 0l-3-3m3 3l3-3m-3 7a4 4 0 110-8 4 4 0 010 8z" /></svg>
                        <h1 className="text-5xl md:text-6xl font-extrabold text-white tracking-tight">
                            Hapsara Agri-Tech
                        </h1>
                    </div>
                    <p className="mt-4 text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
                        An integrated platform for the Oil Palm Mission ecosystem, delivering real-time insights and operational excellence.
                    </p>
                    <div className="mt-10">
                        <button 
                            onClick={onLogin}
                            className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-4 px-10 rounded-lg text-lg transition-transform transform hover:scale-105"
                        >
                            Access Dashboard
                        </button>
                    </div>
                </main>
            </div>

            <section id="features" className="py-20 px-8 bg-gray-900">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-4xl font-bold text-center text-white mb-12">Powerful Features for a Smarter Ecosystem</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <FeatureCard icon={<SparklesIcon />} title="AI-Powered Insights">
                            Leverage Gemini for advanced analytics, strategic recommendations, and predictive forecasting to drive better decision-making.
                        </FeatureCard>
                        <FeatureCard icon={<RectangleGroupIcon />} title="Comprehensive Management">
                            Seamlessly manage farmers, procurement, financials, and inventory from a single, unified dashboard.
                        </FeatureCard>
                        <FeatureCard icon={<DocumentChartBarIcon />} title="Real-time Dashboards">
                            Visualize key metrics with interactive charts and tables, providing a clear overview of your operations at a glance.
                        </FeatureCard>
                        <FeatureCard icon={<UserGroupIcon />} title="Farmer Self-Service">
                            Empower farmers with a dedicated portal to view their data, request services, and log activities, enhancing engagement.
                        </FeatureCard>
                    </div>
                </div>
            </section>

            <footer className="bg-gray-800/50 py-6 px-8 text-center text-gray-500">
                <p>&copy; {new Date().getFullYear()} Hapsara Agri-Tech. All Rights Reserved.</p>
            </footer>
        </div>
    );
};

export default LandingPage;
