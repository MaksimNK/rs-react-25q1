import { Component, ReactNode } from 'react';
import Item from './Item';
import { IItem } from '../utils/api';

interface IListProps {
  items: IItem[];
}

class ListItem extends Component<IListProps> {
  render(): ReactNode {
    return (
      <div>
        <ul>
          {this.props.items.map((item) => (
            <li key={item.url}>
              <Item data={item} />
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default ListItem;
