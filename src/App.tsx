import { Component, ReactNode } from 'react';
import './App.css';
import Search from './components/Search';
import ListItem from './components/ListItem';
import ENDPOINTS from './utils/endpoint';
import { fetchData, IItem } from './utils/api';

interface IAppState {
  searchTerm: string;
  items: IItem[];
  loading: boolean;
  error: string | null;
  category: string;
  hasError: boolean;
}

class App extends Component<object, IAppState> {
  state: IAppState = {
    searchTerm: '',
    items: [],
    loading: false,
    error: null,
    category: 'people',
    hasError: false,
  };

  componentDidMount(): void {
    const searchTerm = localStorage.getItem('searchTerm') || '';
    this.setState({ searchTerm: searchTerm }, () => {
      this.loadData();
    });
  }

  handleSearch = (searchTerm: string): void => {
    this.setState({ searchTerm, loading: true, error: null }, () => {
      localStorage.setItem('searchTerm', searchTerm);
      this.loadData();
    });
  };

  loadData = async (): Promise<void> => {
    this.setState({ loading: true, error: null, items: [], hasError: false });

    try {
      const data = await fetchData(this.state.category, this.state.searchTerm);
      this.setState({ items: data, loading: false });

      if (!data || data.length === 0) {
        this.setState({ error: 'No results found.' });
      }
    } catch (error) {
      console.error('Fetch error:', error);
      this.setState({ loading: false, error: 'Error fetching data.' });
      this.setState({
        loading: false,
        error: 'Error fetching data.',
        hasError: true,
      });
    }
  };

  handleCategoryChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ): void => {
    const category = event.target.value;
    this.setState({ category }, () => this.loadData());
  };

  triggerError = () => {
    this.setState({ hasError: true });
  };

  render(): ReactNode {
    const { searchTerm, items, loading, error, category, hasError } =
      this.state;

    if (hasError) {
      throw new Error('New Error');
    }
    return (
      <div className="app-container">
        <div className="search-select-container">
          <div className="search-container">
            <Search searchTerm={searchTerm} handleSearch={this.handleSearch} />
          </div>
          <select
            className="category-select"
            onChange={this.handleCategoryChange}
            value={category}
          >
            {Object.keys(ENDPOINTS).map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>
        </div>
        <div className="content-area">
          {loading && <div className="loading">Loading...</div>}
          {error && <div className="error">{error}</div>}
          <div className="list-container">
            <ListItem items={items} />
          </div>
          <button className="error-button" onClick={this.triggerError}>
            Error button
          </button>
        </div>
      </div>
    );
  }
}

export default App;
