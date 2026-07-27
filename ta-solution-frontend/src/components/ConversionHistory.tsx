import React from 'react';
import { useHistoryStore } from '../store/useHistoryStore';
import { useConverterStore } from '../store/useConverterStore';
import type { ConversionHistoryItem } from '../types/currency';

export const ConversionHistory: React.FC = () => {
  const history = useHistoryStore((state) => state.history);
  const deleteHistoryItem = useHistoryStore((state) => state.deleteHistoryItem);
  const clearHistory = useHistoryStore((state) => state.clearHistory);
  const applyPreset = useConverterStore((state) => state.applyPreset);

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  const handleSelectPreset = (item: ConversionHistoryItem) => {
    applyPreset(item);
  };

  return (
    <div className="card border-0 shadow-lg rounded-4 overflow-hidden glass-card">
      <div className="card-header bg-white p-4 d-flex justify-content-between align-items-center border-bottom">
        <div>
          <h2 className="h5 fw-bold mb-1 text-dark d-flex align-items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-clock-history text-primary" viewBox="0 0 16 16">
              <path d="M8.515 1.019A7 7 0 0 0 8 1V0a8 8 0 0 1 .589.022l-.074.997zm2.004.45a7.003 7.003 0 0 0-.985-.299l.219-.976c.383.086.76.2 1.13.344l-.364.931zm1.728 1.07a7 7 0 0 0-.79-.563l.465-.885c.348.183.682.385 1 .605l-.675.843zm1.875 1.705a7 7 0 0 0-.528-.809l.74-.672c.28.308.538.636.772.981l-.984.5zm1.144 2.124a7 7 0 0 0-.256-.994l.942-.336c.137.382.25.772.338 1.17l-.994.16zm.185 2.155a7 7 0 0 0 .025-.588h1a8 8 0 0 1-.03.676l-.995-.088zm-.338 2.126a7 7 0 0 0 .256-.995l.994.16c-.088.398-.201.788-.338 1.17l-.942-.335zm-1.144 2.124a7 7 0 0 0 .528-.809l.984.5a8.002 8.002 0 0 1-.772.98l-.74-.671zm-1.875 1.705a7 7 0 0 0 .79-.563l.675.843c-.318.22-.652.422-1 .605l-.465-.885zm-2.124 1.144a7 7 0 0 0 .985-.299l.364.931c-.37.144-.747.258-1.13.344l-.219-.976zM8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 1 8 0a8 8 0 0 1 0 16z" />
              <path d="M7.5 3a.5.5 0 0 1 .5.5v5.21l3.248 1.856a.5.5 0 0 1-.496.868l-3.5-2A.5.5 0 0 1 7 9V3.5a.5.5 0 0 1 .5-.5z" />
            </svg>
            Conversion History
          </h2>
          <p className="mb-0 text-muted small">Persisted via Zustand LocalStorage Middleware</p>
        </div>

        {history.length > 0 && (
          <button
            type="button"
            className="btn btn-outline-danger btn-sm rounded-pill px-3"
            onClick={clearHistory}
          >
            Clear All
          </button>
        )}
      </div>

      <div className="card-body p-0">
        {history.length === 0 ? (
          <div className="text-center py-5 px-3">
            <div className="empty-icon text-muted mx-auto mb-3 opacity-50">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" className="bi bi-journal-x" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M6.146 6.146a.5.5 0 0 1 .708 0L8 7.293l1.146-1.147a.5.5 0 1 1 .708.708L8.707 8l1.147 1.146a.5.5 0 0 1-.708.708L8 8.707l-1.146 1.147a.5.5 0 0 1-.708-.708L7.293 8 6.146 6.854a.5.5 0 0 1 0-.708z" />
                <path d="M3 0h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2zm0 1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H3z" />
              </svg>
            </div>
            <h6 className="fw-semibold text-dark">No conversions recorded yet</h6>
            <p className="text-muted small mb-0">Your conversion history will automatically appear here.</p>
          </div>
        ) : (
          <div className="list-group list-group-flush max-history-height overflow-auto">
            {history.map((item) => (
              <div
                key={item.id}
                className="list-group-item list-group-item-action p-3 border-bottom transition-all hover-bg-light"
              >
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div className="d-flex align-items-center gap-2 flex-wrap">
                    <span className="fw-bold fs-6 text-dark">
                      {item.amount.toLocaleString()} {item.from}
                    </span>
                    <span className="text-muted">→</span>
                    <span className="fw-bold fs-6 text-primary">
                      {item.result.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })} {item.to}
                    </span>
                  </div>

                  <div className="d-flex align-items-center gap-1">
                    <button
                      type="button"
                      className="btn btn-sm btn-light-primary text-primary fw-semibold rounded-pill px-2 py-1 me-1"
                      onClick={() => handleSelectPreset(item)}
                      title="Reuse parameters"
                    >
                      Reuse
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-link text-muted p-1 hover-text-danger"
                      onClick={() => deleteHistoryItem(item.id)}
                      title="Delete entry"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                        <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="d-flex justify-content-between align-items-center text-muted small flex-wrap gap-1">
                  <div className="d-flex align-items-center gap-2">
                    <span className="badge bg-light text-dark border">Rate: {item.rate}</span>
                    {item.isHistorical && (
                      <span className="badge bg-info-subtle text-info border border-info-subtle">
                        📅 {item.date}
                      </span>
                    )}
                  </div>

                  <span className="text-muted extra-small">
                    {formatDate(item.timestamp)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
