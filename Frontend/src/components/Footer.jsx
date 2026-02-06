import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Github, Info } from 'lucide-react';

const Footer = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Custom handler for "How It Works" to ensure smooth scrolling
    const handleScrollToSection = (e, sectionId) => {
        e.preventDefault();

        // If we're not on the home page, navigate there first
        if (location.pathname !== '/') {
            navigate(`/#${sectionId}`);
            // Small timeout to allow navigation to complete before scrolling
            setTimeout(() => {
                const element = document.getElementById(sectionId);
                if (element) element.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        } else {
            // We are already on home, just scroll
            const element = document.getElementById(sectionId);
            if (element) element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <footer className="bg-white border-t border-gray-200 pt-16 pb-8 mt-auto">
            <div className="max-w-7xl mx-auto px-6">
                {/* Main Top Section: 2-Column Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
                    {/* Left Side: Brand */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <h3 className="text-2xl font-bold text-emerald-600 font-sans">Ingredient Co-Pilot</h3>
                        </div>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            Understanding food, one ingredient at a time.
                        </p>
                    </div>

                    {/* Right Side: Links */}
                    <div className="grid grid-cols-2 gap-8">
                        {/* PRODUCT Column */}
                        <div>
                            <h4 className="font-bold text-slate-800 mb-4 text-sm tracking-wider">PRODUCT</h4>
                            <ul className="space-y-3 text-sm text-gray-500">
                                <li>
                                    <Link to="/" className="hover:text-emerald-600 transition-colors">
                                        Home
                                    </Link>
                                </li>
                                <li>
                                    {/* Assuming '/chat' is your main scan/analysis page based on previous context */}
                                    <Link to="/chat" className="hover:text-emerald-600 transition-colors">
                                        Analyze Product
                                    </Link>
                                </li>
                                <li>
                                    <a
                                        href="#how-it-works"
                                        onClick={(e) => handleScrollToSection(e, 'how-it-works')}
                                        className="hover:text-emerald-600 transition-colors"
                                    >
                                        How It Works
                                    </a>
                                </li>
                                <li>
                                    <Link to="/compare" className="hover:text-emerald-600 transition-colors">
                                        Compare Products
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* RESOURCES Column */}
                        <div>
                            <h4 className="font-bold text-slate-800 mb-4 text-sm tracking-wider">RESOURCES</h4>
                            <ul className="space-y-3 text-sm text-gray-500">
                                <li>
                                    <Link to="/about" className="hover:text-emerald-600 transition-colors">
                                        About Us
                                    </Link>
                                </li>
                                <li>
                                    <a
                                        href="https://github.com/ritomsk/IngredientAI"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="hover:text-emerald-600 transition-colors flex items-center gap-2"
                                    >
                                        <Github size={16} />
                                        GitHub
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Disclaimer Box */}
                <div className="mb-12">
                    <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-4 text-sm text-gray-600 flex gap-3 items-start">
                        <Info size={20} className="text-emerald-600 shrink-0 mt-0.5" />
                        <p>
                            <span className="font-bold text-emerald-800">Disclaimer:</span> This tool provides educational information only and is not medical advice. Always consult healthcare professionals for dietary decisions, especially if you have allergies or health conditions.
                        </p>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="border-t border-gray-200 pt-8 flex flex-col items-center text-center text-sm text-gray-500">
                    <p className="mb-2">© 2026 Ingredient Co-Pilot. All rights reserved.</p>
                    <Link to="/terms" className="hover:text-emerald-600 transition-colors">
                        Terms of Service
                    </Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;