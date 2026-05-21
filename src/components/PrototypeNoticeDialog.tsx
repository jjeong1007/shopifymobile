import './PrototypeNoticeDialog.css';

type PrototypeNoticeDialogProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
};

export function PrototypeNoticeDialog({
  open,
  onClose,
  title = 'Not part of this test',
  description = 'This is not part of the user test you are currently doing.',
}: PrototypeNoticeDialogProps) {
  if (!open) return null;

  return (
    <div className="prototype-notice">
      <button type="button" className="prototype-notice__backdrop" aria-label="Close" onClick={onClose} />
      <div className="prototype-notice__dialog" role="dialog" aria-modal="true" aria-labelledby="prototype-notice-title">
        <h2 id="prototype-notice-title" className="prototype-notice__title">
          {title}
        </h2>
        <p className="prototype-notice__desc">{description}</p>
        <button type="button" className="prototype-notice__btn" onClick={onClose}>
          OK
        </button>
      </div>
    </div>
  );
}
