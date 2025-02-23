import { FC, useEffect, useState } from 'react';
import Search from '../components/Search';
import ListItem from '../components/ListItem';
import { Outlet, useSearchParams, useNavigate } from 'react-router-dom';
import { Pagination } from '../components/Pagination';
import Flyout from '../components/Flyout';
import { useFetchDataQuery } from '../redux/apiSlice';

export const MainPage: FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState<string>('');
  const details = searchParams.get('details');
  const currentPage = Number(searchParams.get('page')) || 1;

  const { data, error, isLoading } = useFetchDataQuery({
    category: 'people',
    searchTerm,
    page: currentPage,
  });

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

  const totalPages = data ? Math.ceil(data.count / 10) : 0;

  return (
    <div className="container">
      <div className="left-section">
        <div className="search-container">
          <Search searchTerm={searchTerm} handleSearch={handleSearch} />
        </div>
        {isLoading && <div>Loading...</div>}
        {error && <div className="error">Error fetching data</div>}
        {data && data.results && <ListItem items={data.results} />}
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
