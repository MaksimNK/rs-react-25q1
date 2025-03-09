'use client';

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Search from '../components/Search';
import ListItem from '../components/ListItem';
import Pagination from '../components/Pagination';
import Flyout from '../components/Flyout';
import { useFetchDataQuery } from '../redux/apiSlice';
import DetailItemPage from '../components/DetailItemPage';

export default function HomePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialSearch = searchParams.get('search') || '';
  const initialPage = Number(searchParams.get('page')) || 1;
  const [searchTerm, setSearchTerm] = useState<string>(initialSearch);

  const { data, error, isLoading } = useFetchDataQuery({
    category: 'people',
    searchTerm,
    page: initialPage,
  });

  const handlePageChange = (newPage: number) => {
    router.push(`/?search=${searchTerm}&page=${newPage}`);
  };

  const handleSearch = (newSearchTerm: string) => {
    setSearchTerm(newSearchTerm);
    router.push(`/?search=${newSearchTerm}&page=1`);
  };

  const handleCloseDetails = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('details');
    router.push(`/?${params.toString()}`);
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
            currentPage={initialPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
      <div className="right-section">
        {searchParams.get('details') && (
          <DetailItemPage
            id={searchParams.get('details') as string}
            onClose={handleCloseDetails}
          />
        )}
      </div>
      <Flyout />
    </div>
  );
}
