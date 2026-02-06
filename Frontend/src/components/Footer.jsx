import React from 'react';

const Footer = () => {
    return (
        <footer className="w-full py-6 mt-12 border-t border-border-glass">
            <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-text-muted font-medium">
                <p>© 2026 IngredientAI. All rights reserved.</p>
                <div className="flex gap-6">
                    <a href="#" className="hover:text-text-primary transition-colors">Privacy Policy</a>
                    <a href="#" className="hover:text-text-primary transition-colors">Terms of Service</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
