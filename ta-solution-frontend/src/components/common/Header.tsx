import React from 'react';
import { useCurrenciesQuery } from '../../hooks/useCurrenciesQuery';

const Header: React.FC = () => {
  const { data: currenciesData } = useCurrenciesQuery();
  const isFallback = currenciesData?.isFallback;

  return (
    <header className="app-header py-3 px-3 mb-4 rounded-4 shadow-sm">
      <div className="container-fluid d-flex align-items-center justify-content-between flex-wrap gap-2">
        <div className="d-flex align-items-center gap-2">
          <div className="brand-icon rounded-3 p-2 d-flex align-items-center justify-content-center bg-primary text-white shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-currency-exchange" viewBox="0 0 16 16">
              <path d="M0 5a5 5 0 0 0 4.5 4.975V11H3a.5.5 0 0 0 0 1h1.5v1.5a.5.5 0 0 0 1 0V12h2a.5.5 0 0 0 0-1h-2V9.975A5 5 0 0 0 10 5c0-.12-.004-.239-.011-.358L10.94 5.6a.5.5 0 1 0 .708-.707l-1.5-1.5a.5.5 0 0 0-.708 0l-1.5 1.5a.5.5 0 1 0 .708.707l.95-.95A3.996 3.996 0 0 1 6 8a4 4 0 0 1-4-4c0-.778.222-1.504.606-2.119a.5.5 0 1 0-.84-.543A4.99 4.99 0 0 0 0 5z" />
              <path d="M16 11a5 5 0 0 0-4.5-4.975V5H13a.5.5 0 0 0 0-1h-1.5V2.5a.5.5 0 0 0-1 0V4h-2a.5.5 0 0 0 0 1h2v1.025A5 5 0 0 0 6 11c0 .12.004.239.011.358L5.06 10.4a.5.5 0 0 0-.708.707l1.5 1.5a.5.5 0 0 0 .708 0l1.5-1.5a.5.5 0 1 0-.708-.707l-.95.95A3.996 3.996 0 0 1 10 8a4 4 0 0 1 4 4c0 .778-.222 1.504-.606 2.119a.5.5 0 1 0 .84.543A4.99 4.99 0 0 0 16 11z" />
            </svg>
          </div>
          <div>
            <h1 className="h5 mb-0 fw-bold text-gradient">CurrEx</h1>
            <span className="small text-muted">TanStack Query + Axios + Zustand</span>
          </div>
        </div>

        <div className="d-flex align-items-center gap-2">
          <span className="badge rounded-pill bg-success-subtle text-success border border-success-subtle px-3 py-2">
            <span className="status-dot me-1"></span> NestJS Connected
          </span>
          {isFallback && (
            <span className="badge rounded-pill bg-warning-subtle text-warning-emphasis border border-warning-subtle px-3 py-2" title="API rate limit reached, using fallback rates">
              ⚡ Fallback Mode
            </span>
          )}
        </div>
      </div>
    </header>
  );
};


export default Header;
