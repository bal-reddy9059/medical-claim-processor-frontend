import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/ai-pipeline-status', label: 'AI Pipeline Status' },
  { to: '/claim-dashboard', label: 'Claim Dashboard' },
  { to: '/claimprecision-medical-billing-pipeline', label: 'Medical Billing Pipeline' },
  { to: '/pipeline-settings', label: 'Pipeline Settings' },
  { to: '/review-extraction-results', label: 'Review Extraction Results' },
];

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 bg-primary text-on-primary shadow-md">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-4 py-4 gap-4">
        <NavLink to="/" className="flex items-center gap-3 text-xl font-black uppercase tracking-tight hover:text-primary-fixed-dim">
          <span className="material-symbols-outlined text-3xl">medical_services</span>
          Stitch Multi-Agent Claim Processing
        </NavLink>
        <div className="flex flex-wrap items-center justify-center gap-3 text-sm font-semibold">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `rounded-full px-4 py-2 transition-colors duration-200 ${
                  isActive ? 'bg-primary-container text-white shadow-lg' : 'text-on-primary/80 hover:text-on-primary hover:bg-primary-fixed/10'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;