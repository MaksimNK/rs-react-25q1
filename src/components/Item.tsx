'use client';

import { FC } from 'react';
import { useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { useDispatch } from 'react-redux';
import { selectItem, unSelectItem } from '../redux/selectItemSlice';
import { IItem } from '../types/item';

interface IItemProps {
  data: IItem;
}

interface IItemProps {
  data: IItem;
}

export const Item: FC<IItemProps> = ({ data }) => {
  const { name, model } = data;
  const selectedItems = useSelector(
    (state: RootState) => state.selectedItem.items
  );
  const selected = selectedItems.some((item) => item.url === data.url);
  const dispatch = useDispatch<AppDispatch>();

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      dispatch(selectItem(data));
    } else {
      dispatch(unSelectItem(data));
    }
  };

  return (
    <div className="list-item-container">
      <h3>{name}</h3>
      <input
        type="checkbox"
        checked={selected}
        onChange={handleCheckboxChange}
      />
      {model && <p>Model: {model}</p>}
    </div>
  );
};

export default Item;
