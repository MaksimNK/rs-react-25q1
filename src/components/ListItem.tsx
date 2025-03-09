'use client';

import { FC } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Item from './Item';
import { IItem } from '../types/item';

interface IListItemProps {
  items: IItem[];
}

export const ListItem: FC<IListItemProps> = ({ items }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleItemClick = (event: React.MouseEvent, id: string) => {
    event.stopPropagation();
    const params = new URLSearchParams(searchParams.toString());
    params.set('details', id);
    router.push(`/?${params.toString()}`);
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
