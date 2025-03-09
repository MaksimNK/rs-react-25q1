'use client';
import { useFetchSinglePersonQuery } from '../redux/apiSlice';

interface DetailItemProps {
  id: string;
  onClose: () => void;
}

const DetailItemPage: React.FC<DetailItemProps> = ({ id, onClose }) => {
  const {
    data: item,
    error,
    isLoading,
  } = useFetchSinglePersonQuery({ id, category: 'people' }, { skip: !id });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div className="error">Error fetching data.</div>;
  if (!item) return <div>No data found.</div>;

  return (
    <div className="details-panel">
      <button className="close-button" onClick={onClose}>
        Close
      </button>
      <h2>{item.name}</h2>
      <p>{item.model}</p>
    </div>
  );
};

export default DetailItemPage;
