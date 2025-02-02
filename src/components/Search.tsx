import { Component, ReactNode } from 'react';

interface ISearchProps {
  searchTerm: string;
  handleSearch: (query: string) => void;
}

interface ISearchState {
  inputValue: string;
}

class Search extends Component<ISearchProps, ISearchState> {
  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ inputValue: event.target.value });
  };

  constructor(props: ISearchProps) {
    super(props);
    this.state = {
      inputValue: props.searchTerm || '',
    };
  }

  handleSearch = () => {
    const trimValue = this.state.inputValue.trim();
    this.props.handleSearch(trimValue);
  };

  handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === 'Enter') {
      this.handleSearch();
    }
  };

  render(): ReactNode {
    return (
      <div className="search-container">
        <input
          type="text"
          placeholder="Let's find"
          value={this.state.inputValue}
          onChange={this.handleChange}
          onKeyDown={this.handleKeyDown}
        />
        <button onClick={this.handleSearch}>Search</button>
      </div>
    );
  }
}

export default Search;
