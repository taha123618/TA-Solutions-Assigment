import React, { useState, useEffect } from 'react';
import { useConverterStore } from '../store/useConverterStore';
import { useCurrenciesQuery } from '../hooks/useCurrenciesQuery';
import { useConvertMutation } from '../hooks/useConvertMutation';

export const CurrencyConverter: React.FC = () => {
  const [copied, setCopied] = useState(false);

  // Zustand Store selectors
  const amount = useConverterStore((state) => state.amount);
  const fromCurrency = useConverterStore((state) => state.fromCurrency);
  const toCurrency = useConverterStore((state) => state.toCurrency);
  const isHistorical = useConverterStore((state) => state.isHistorical);
  const historicalDate = useConverterStore((state) => state.historicalDate);

  const setAmount = useConverterStore((state) => state.setAmount);
  const setFromCurrency = useConverterStore((state) => state.setFromCurrency);
  const setToCurrency = useConverterStore((state) => state.setToCurrency);
  const setIsHistorical = useConverterStore((state) => state.setIsHistorical);
  const setHistoricalDate = useConverterStore((state) => state.setHistoricalDate);
  const swapCurrenciesState = useConverterStore((state) => state.swapCurrencies);

  // TanStack React Query
  const { data: currenciesData, isLoading: currenciesLoading } = useCurrenciesQuery();
  const convertMutation = useConvertMutation();

  const currencies = currenciesData?.data || {};
  const isFallback = currenciesData?.isFallback;
  const currencyList = Object.values(currencies).sort((a, b) => a.code.localeCompare(b.code));
  const todayStr = new Date().toISOString().split('T')[0];

  // Trigger initial conversion when currencies are loaded
  useEffect(() => {
    if (!currenciesLoading && !convertMutation.data && !convertMutation.isPending) {
      const numAmt = parseFloat(amount);
      if (!isNaN(numAmt) && numAmt > 0) {
        convertMutation.mutate({
          amount: numAmt,
          from: fromCurrency,
          to: toCurrency,
          date: isHistorical ? historicalDate : undefined,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currenciesLoading]);

  const handleConvert = (
    overrideAmt?: string,
    overrideFrom?: string,
    overrideTo?: string,
    overrideHist?: boolean,
    overrideDate?: string
  ) => {
    const numAmount = parseFloat(overrideAmt ?? amount);
    if (isNaN(numAmount) || numAmount <= 0) return;

    convertMutation.mutate({
      amount: numAmount,
      from: overrideFrom || fromCurrency,
      to: overrideTo || toCurrency,
      date: (overrideHist ?? isHistorical) ? (overrideDate || historicalDate) : undefined,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleConvert();
  };

  const handleSwap = () => {
    const newFrom = toCurrency;
    const newTo = fromCurrency;
    swapCurrenciesState();
    handleConvert(amount, newFrom, newTo);
  };

  const getSymbol = (code: string) => {
    return currencies[code]?.symbol || code;
  };

  const handleCopy = (textToCopy: string) => {
    void navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const quickAmounts = ['10', '50', '100', '500', '1000'];
  const conversionResult = convertMutation.data;

  return (
    <div className="card border-0 shadow-lg rounded-4 overflow-hidden mb-4 glass-card">
      <div className="card-header bg-gradient-primary text-white p-4">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
          <div>
            <h2 className="h4 fw-bold mb-1">Currency Converter</h2>
            {/* <p className="mb-0 text-white-50 small">Powered by TanStack Query, Axios & Zustand</p> */}
          </div>

          <div className="d-flex align-items-center gap-2">
            {isFallback && (
              <span className="badge bg-warning text-dark me-2">⚡ Fallback Mode</span>
            )}
            {/* Historical Rate Toggle */}
            <div className="form-check form-switch bg-white-10 rounded-pill px-3 py-2 d-flex align-items-center gap-2 m-0 border border-white-20">
              <input
                className="form-check-input ms-0 cursor-pointer"
                type="checkbox"
                role="switch"
                id="historicalSwitch"
                checked={isHistorical}
                onChange={(e) => setIsHistorical(e.target.checked)}
              />
              <label className="form-check-label text-white small cursor-pointer fw-semibold" htmlFor="historicalSwitch">
                📅 Historical Mode
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="card-body p-4">
        {convertMutation.isError && (
          <div className="alert alert-danger alert-dismissible fade show rounded-3 mb-4" role="alert">
            <div className="d-flex align-items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-exclamation-triangle-fill flex-shrink-0" viewBox="0 0 16 16">
                <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
              </svg>
              <span>{convertMutation.error?.message || 'An error occurred during conversion'}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            {/* Historical Date Input if historical mode enabled */}
            {isHistorical && (
              <div className="col-12 animate-fade-in">
                <div className="p-3 bg-light-subtle rounded-3 border">
                  <label htmlFor="historicalDateInput" className="form-label text-muted small fw-semibold d-flex align-items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-calendar-event" viewBox="0 0 16 16">
                      <path d="M11 6.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1z" />
                      <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z" />
                    </svg>
                    Select Historical Date
                  </label>
                  <input
                    type="date"
                    id="historicalDateInput"
                    className="form-control form-control-lg border-2"
                    value={historicalDate}
                    max={todayStr}
                    onChange={(e) => setHistoricalDate(e.target.value)}
                    required={isHistorical}
                  />
                  <small className="text-muted mt-1 d-block">Converts using the exchange rate recorded on this date.</small>
                </div>
              </div>
            )}

            {/* Amount Field & Presets */}
            <div className="col-12">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <label htmlFor="amountInput" className="form-label text-muted small fw-semibold mb-0">Amount</label>
                <div className="d-flex gap-1">
                  {quickAmounts.map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      className={`btn btn-sm ${amount === amt ? 'btn-primary' : 'btn-outline-secondary'} py-0 px-2 extra-small rounded-pill`}
                      onClick={() => {
                        setAmount(amt);
                        handleConvert(amt);
                      }}
                    >
                      {getSymbol(fromCurrency)}{amt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="input-group input-group-lg shadow-sm">
                <span className="input-group-text bg-white text-muted border-2 border-end-0 fw-bold fs-5">
                  {getSymbol(fromCurrency)}
                </span>
                <input
                  type="number"
                  id="amountInput"
                  className="form-control border-2 border-start-0 fs-4 fw-bold"
                  placeholder="0.00"
                  step="any"
                  min="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* From Currency Select */}
            <div className="col-12 col-md-5">
              <label htmlFor="fromCurrencySelect" className="form-label text-muted small fw-semibold">From Currency</label>
              {currenciesLoading ? (
                <div className="placeholder-glow">
                  <span className="placeholder col-12 rounded-3 py-3"></span>
                </div>
              ) : (
                <select
                  id="fromCurrencySelect"
                  className="form-select form-select-lg border-2 shadow-sm cursor-pointer"
                  value={fromCurrency}
                  onChange={(e) => {
                    const newFrom = e.target.value;
                    setFromCurrency(newFrom);
                    handleConvert(amount, newFrom);
                  }}
                >
                  {currencyList.map((curr) => (
                    <option key={curr.code} value={curr.code}>
                      {curr.code} - {curr.name} ({curr.symbol})
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Swap Button */}
            <div className="col-12 col-md-2 d-flex align-items-end justify-content-center py-2 py-md-0">
              <button
                type="button"
                className="btn btn-outline-primary btn-swap rounded-circle shadow-sm p-3 d-flex align-items-center justify-content-center"
                onClick={handleSwap}
                title="Swap currencies"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-arrow-left-right" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M1 11.5a.5.5 0 0 0 .5.5h11.793l-3.147 3.146a.5.5 0 0 0 .708.708l4-4a.5.5 0 0 0-.708-.708l-4-4a.5.5 0 0 0-.708.708L13.293 11H1.5a.5.5 0 0 0-.5.5zm14-7a.5.5 0 0 1-.5.5H2.707l3.147 3.146a.5.5 0 1 1-.708.708l-4-4a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 4H14.5a.5.5 0 0 1 .5.5z" />
                </svg>
              </button>
            </div>

            {/* To Currency Select */}
            <div className="col-12 col-md-5">
              <label htmlFor="toCurrencySelect" className="form-label text-muted small fw-semibold">To Currency</label>
              {currenciesLoading ? (
                <div className="placeholder-glow">
                  <span className="placeholder col-12 rounded-3 py-3"></span>
                </div>
              ) : (
                <select
                  id="toCurrencySelect"
                  className="form-select form-select-lg border-2 shadow-sm cursor-pointer"
                  value={toCurrency}
                  onChange={(e) => {
                    const newTo = e.target.value;
                    setToCurrency(newTo);
                    handleConvert(amount, fromCurrency, newTo);
                  }}
                >
                  {currencyList.map((curr) => (
                    <option key={curr.code} value={curr.code}>
                      {curr.code} - {curr.name} ({curr.symbol})
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Submit Button */}
            <div className="col-12 mt-4">
              <button
                type="submit"
                className="btn btn-primary btn-lg w-100 py-3 rounded-3 fw-bold shadow hover-lift"
                disabled={convertMutation.isPending || currenciesLoading}
              >
                {convertMutation.isPending ? (
                  <span className="d-flex align-items-center justify-content-center gap-2">
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    Converting via React Query...
                  </span>
                ) : (
                  <span>Convert Now</span>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Result Area */}
        <div className="mt-4">
          {convertMutation.isPending ? (
            <div className="card bg-light border-0 rounded-4 p-4 text-center">
              <div className="spinner-border text-primary mx-auto mb-2" role="status">
                <span className="visually-hidden">Loading conversion...</span>
              </div>
              <p className="text-muted mb-0 small">Fetching rate via Axios & TanStack Query...</p>
            </div>
          ) : conversionResult ? (
            <div className="card bg-gradient-subtle border-0 rounded-4 p-4 shadow-sm animate-fade-in position-relative">
              <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-2">
                <span className="text-muted small fw-semibold">
                  {conversionResult.amount} {conversionResult.from} =
                </span>
                <span className="badge bg-secondary-subtle text-secondary border px-2 py-1 small">
                  {conversionResult.isHistorical ? `📅 Rate on ${conversionResult.date}` : '⚡ Live Rate'}
                </span>
              </div>

              <div className="d-flex align-items-baseline justify-content-between flex-wrap gap-2 my-1">
                <div className="d-flex align-items-baseline gap-2">
                  <h3 className="display-6 fw-bold mb-0 text-primary">
                    {conversionResult.result.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                  </h3>
                  <span className="fs-4 fw-semibold text-secondary">{conversionResult.to}</span>
                </div>

                <button
                  type="button"
                  className="btn btn-sm btn-outline-primary rounded-pill px-3 py-1"
                  onClick={() => handleCopy(`${conversionResult.result} ${conversionResult.to}`)}
                >
                  {copied ? 'Copied!' : 'Copy Result'}
                </button>
              </div>

              <div className="mt-3 pt-3 border-top d-flex justify-content-between align-items-center flex-wrap gap-2 text-muted small">
                <div>
                  1 {conversionResult.from} = <span className="fw-bold text-dark">{conversionResult.rate}</span> {conversionResult.to}
                </div>
                <div className="text-end">
                  Updated: {new Date(conversionResult.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
