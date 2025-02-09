import { IItem } from '../utils/api';

interface IItemProps {
  data: IItem;
}

import { FC } from 'react';
interface IItemProps {
  data: IItem;
}

export const Item: FC<IItemProps> = ({ data }) => {
  const { name, model } = data;

  return (
    <div className="list-item-container">
      <h3>{name}</h3>
      {model && <p>Model: {model}</p>}
    </div>
  );
};

export default Item;
