import { Component, ReactNode } from 'react';
import { IItem } from '../utils/api';

interface IItemProps {
  data: IItem;
}

class Item extends Component<IItemProps> {
  render(): ReactNode {
    const { data } = this.props;

    const { name, model, url } = data;

    return (
      <div className="list-item-container">
        <h3>{name}</h3>
        {model && <p>Model: {model}</p>}
        <p>
          <a href={url}>Learn More</a>
        </p>
      </div>
    );
  }
}

export default Item;
