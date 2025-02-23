import { FC } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFetchSinglePersonQuery } from '../redux/apiSlice';
export const DetailItemPage: FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    data: item,
    error,
    isLoading,
  } = useFetchSinglePersonQuery(
    { id: id as string, category: 'people' },
    { skip: !id }
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div className="error">Error fetching data.</div>;
  if (!item) return <div>No data found.</div>;

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
