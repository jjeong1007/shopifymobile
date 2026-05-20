import { useEffect, useState } from 'react';
import { getProductDescription, setProductDescription } from '../lib/productDraft';
import './ProductFieldSheet.css';

type ProductDescriptionSheetProps = {
  open: boolean;
  onClose: () => void;
  onSave: (description: string) => void;
};

export function ProductDescriptionSheet({ open, onClose, onSave }: ProductDescriptionSheetProps) {
  const [visible, setVisible] = useState(open);
  const [description, setDescription] = useState(() => getProductDescription());

  useEffect(() => {
    if (open) {
      setVisible(true);
      setDescription(getProductDescription());
    }
  }, [open]);

  useEffect(() => {
    if (!open && visible) {
      const timer = window.setTimeout(() => setVisible(false), 280);
      return () => window.clearTimeout(timer);
    }
    return undefined;
  }, [open, visible]);

  if (!visible) return null;

  const canSave = description.trim().length > 0;

  const handleDone = () => {
    const value = description.trim();
    setProductDescription(value);
    onSave(value);
    onClose();
  };

  return (
    <div
      className={`product-field-sheet${open ? ' product-field-sheet--open' : ''}`}
      role="presentation"
    >
      <button
        type="button"
        className="product-field-sheet__backdrop"
        aria-label="Close description editor"
        onClick={onClose}
      />
      <div
        className="product-field-sheet__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-description-sheet-title"
      >
        <div className="product-field-sheet__handle" aria-hidden />

        <header className="product-field-sheet__header">
          <button type="button" className="product-field-sheet__header-btn" onClick={onClose}>
            Cancel
          </button>
          <h2 id="product-description-sheet-title" className="product-field-sheet__title">
            Description
          </h2>
          <button
            type="button"
            className="product-field-sheet__header-btn product-field-sheet__header-btn--done"
            onClick={handleDone}
            disabled={!canSave}
          >
            Done
          </button>
        </header>

        <div className="product-field-sheet__body">
          <label className="product-field-sheet__field">
            <span className="product-field-sheet__label">Product description</span>
            <textarea
              className="product-field-sheet__textarea"
              placeholder="Handcrafted sterling silver signet ring with a twisted rope band. Each piece is polished by hand in our studio."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>
        </div>
      </div>
    </div>
  );
}
