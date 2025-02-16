import { FC, useEffect, useState } from 'react';
import Search from '../components/Search';
import { IItem } from '../utils/api';
import ListItem from '../components/ListItem';
import { fetchData } from '../utils/api';
import { Outlet, useSearchParams, useNavigate } from 'react-router-dom';
import { Pagination } from '../components/Pagination';
import Flyout from '../components/Flyout';
export const MainPage: FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [items, setItems] = useState<IItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const details = searchParams.get('details');

  const [totalCount, setTotalCount] = useState<number>(0);
  const currentPage = Number(searchParams.get('page')) || 1;

  useEffect(() => {
    const loadData = async (): Promise<void> => {
      setLoading(true);
      try {
        const data = await fetchData('people', searchTerm, currentPage);
        setItems(data.results);
        setTotalCount(data.count);
        if (!data.results || data.results.length === 0) {
          setError('No results found.');
        } else {
          setError(null);
        }
      } catch (error) {
        setError('Error fetching data.' + error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [searchTerm, currentPage]);

  useEffect(() => {
    if (details) {
      navigate(`details/${details}`, { replace: true });
    }
  }, [details, navigate]);

  const handlePageChange = (newPage: number) => {
    searchParams.set('page', newPage.toString());
    setSearchParams(searchParams);
  };

  const handleSearch = (newSearchTerm: string): void => {
    setSearchTerm(newSearchTerm);
    searchParams.set('search', newSearchTerm);
    searchParams.set('page', '1');
    setSearchParams(searchParams);
  };

  const totalPages = Math.ceil(totalCount / 10);

  return (
    <div className="container">
      <div className="left-section">
        <div className="search-container">
          <Search searchTerm={searchTerm} handleSearch={handleSearch} />
        </div>
        {loading && <div>Loading...</div>}
        {error && <div className="error">{error}</div>}
        <ListItem items={items} />
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
      <div className="right-section">
        <Outlet />
      </div>

      <Flyout />
    </div>
  );
};

export default MainPage;
