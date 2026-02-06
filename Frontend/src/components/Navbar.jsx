import React, { useState } from 'react';
import { Menu, X, Zap } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const navLinks = [
        { name: 'About', href: '#' },
        { name: 'Help', href: '#' },
    ];

    return (
        // FIX 1: Changed 'fixed' to 'sticky' to reserve layout space
        // FIX 2: Increased z-index to 100 to ensure it stays on top of all other layers
        <nav className="sticky top-0 w-full z-[100] px-4 py-4 sm:px-6 lg:px-8 pointer-events-none">
            <div className="max-w-7xl mx-auto pointer-events-auto">
                {/* Added explicit backdrop-blur to ensure content scrolling under looks good */}
                <div className="glass rounded-2xl px-6 py-3 flex justify-between items-center bg-white/70 backdrop-blur-md border border-white/20 shadow-sm">
                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-gradient-to-br from-emerald-100 to-indigo-100 rounded-lg">
                            <Zap className="w-5 h-5 text-emerald-700" />
                        </div>
                        <span className="font-bold text-lg tracking-tight text-slate-800">
                            IngredientAI
                        </span>
                    </div>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                            >
                                {link.name}
                            </a>
                        ))}
                        <button className="px-5 py-2.5 bg-slate-900 text-white rounded-full text-sm font-medium hover:bg-slate-800 transition-transform hover:scale-105 active:scale-95 shadow-lg">
                            Get Started
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden p-2 text-slate-600 hover:bg-black/5 rounded-lg transition-colors"
                    >
                        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Nav Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        // Ensure mobile menu is clickable by re-enabling pointer events
                        className="absolute top-20 left-4 right-4 z-40 pointer-events-auto"
                    >
                        <div className="glass rounded-2xl p-4 flex flex-col gap-4 shadow-glass bg-white/90 backdrop-blur-xl border border-white/20">
                            {navLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    className="px-4 py-3 text-slate-700 hover:bg-black/5 rounded-xl transition-colors font-medium"
                                >
                                    {link.name}
                                </a>
                            ))}
                            <button className="w-full py-3 bg-slate-900 text-white rounded-xl font-medium shadow-lg">
                                Get Started
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;