import { useState } from 'react';
import { useRouter } from 'next/router';
import Search from '../components/Search';
import ListItem from '../components/ListItem';
import Pagination from '../components/Pagination';
import Flyout from '../components/Flyout';
import { useFetchDataQuery } from '../redux/apiSlice';
import DetailItemPage from '../components/DetailItemPage';

const MainPage = () => {
  const router = useRouter();
  const { query } = router;

  const [searchTerm, setSearchTerm] = useState<string>(
    (query.search as string) || ''
  );
  const currentPage = Number(query.page) || 1;

  const { data, error, isLoading } = useFetchDataQuery({
    category: 'people',
    searchTerm,
    page: currentPage,
  });

  const handlePageChange = (newPage: number) => {
    router.push({
      pathname: '/',
      query: { ...query, page: newPage.toString() },
    });
  };

  const handleSearch = (newSearchTerm: string): void => {
    setSearchTerm(newSearchTerm);
    router.push({
      pathname: '/',
      query: { search: newSearchTerm, page: '1' },
    });
  };

  const handleCloseDetails = () => {
    const { details, ...restQuery } = query;
    void details;
    router.push({ pathname: '/', query: restQuery });
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
        {query.details && (
          <DetailItemPage
            id={query.details as string}
            onClose={handleCloseDetails}
          />
        )}
      </div>
      <Flyout />
    </div>
  );
};

export default MainPage;
