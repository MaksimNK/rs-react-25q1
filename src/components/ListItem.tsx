import { FC } from 'react';
import Item from './Item';
import { useSearchParams } from 'react-router-dom';
import { IItem } from '../types/item';

interface IListItemProps {
  items: IItem[];
}

export const ListItem: FC<IListItemProps> = ({ items }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleItemClick = (event: React.MouseEvent, id: string) => {
    event.stopPropagation();
    searchParams.set('details', id);
    setSearchParams(searchParams);
  };

  return (
    <div>
      <ul>
        {items.map((item) => {
          const id = item.url.split('/').filter(Boolean).pop() ?? '';
          return (
            <li key={item.url} onClick={(event) => handleItemClick(event, id)}>
              <Item data={item} />
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ListItem;
