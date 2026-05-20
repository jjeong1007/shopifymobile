import { useNavigate } from 'react-router-dom';
import './PlaceholderPage.css';

type PlaceholderPageProps = {
  title: string;
  description: string;
};

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  const navigate = useNavigate();

  return (
    <div className="placeholder">
      <h1 className="placeholder__title">{title}</h1>
      <p className="placeholder__description">{description}</p>
      <button type="button" className="placeholder__back" onClick={() => navigate('/')}>
        Back to welcome
      </button>
    </div>
  );
}
