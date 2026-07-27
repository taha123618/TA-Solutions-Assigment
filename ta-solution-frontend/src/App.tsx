import React from 'react';
import { Header, Footer } from './components/common';
import { CurrencyConverter } from './components/CurrencyConverter';
import { ConversionHistory } from './components/ConversionHistory';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="min-vh-100 py-3 py-md-4 px-2 px-md-0">
      <div className="container" style={{ maxWidth: '840px' }}>
        {/* Header */}
        <Header />

        <main className="row g-4">
          {/* Currency Converter Form Card */}
          <div className="col-12">
            <CurrencyConverter />
          </div>

          {/* Persistent History Panel */}
          <div className="col-12">
            <ConversionHistory />
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default App;
