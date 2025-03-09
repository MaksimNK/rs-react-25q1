import { FC } from 'react';
import { useRouter } from 'next/router';
import Item from './Item';
import { IItem } from '../types/item';

interface IListItemProps {
  items: IItem[];
}

export const ListItem: FC<IListItemProps> = ({ items }) => {
  const router = useRouter();

  const handleItemClick = (event: React.MouseEvent, id: string) => {
    event.stopPropagation();
    router.push({
      pathname: '/',
      query: { ...router.query, details: id },
    });
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
