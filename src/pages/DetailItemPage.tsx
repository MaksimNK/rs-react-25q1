import { FC, useEffect, useState } from 'react';
import { IItem, fetchSinglePerson } from '../utils/api';
import { useParams, useNavigate } from 'react-router-dom';

export const DetailItemPage: FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState<IItem | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadItem = async () => {
      try {
        if (!id) return;
        const data = await fetchSinglePerson(id);
        setItem(data);
      } catch {
        setError('Error fetching data.');
      }
    };
    loadItem();
  }, [id]);

  if (error) return <div className="error">{error}</div>;
  if (!item) return <div>Loading...</div>;

  return (
    <div className="details-panel">
      <button className="close-button" onClick={() => navigate('/')}>
        Close
      </button>
      <h2>{item.name}</h2>
      <p>{item.model}</p>
    </div>
  );
};

export default DetailItemPage;
