'use client';

import React, { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store';
import { unSelectAll } from '../redux/selectItemSlice';

const Flyout: React.FC = () => {
  const selectedItems = useSelector(
    (state: RootState) => state.selectedItem.items
  );
  const dispatch = useDispatch<AppDispatch>();

  const handleUnselectAll = () => {
    dispatch(unSelectAll());
  };

  const csvBlobUrl = useMemo(() => {
    if (selectedItems.length === 0) return null;

    const header = ['name', 'model', 'url'];
    const csvRows = [header.join(',')];

    selectedItems.forEach((item) => {
      const row = [`"${item.name}"`, `"${item.model || ''}"`, `"${item.url}"`];
      csvRows.push(row.join(','));
    });

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });

    return URL.createObjectURL(blob);
  }, [selectedItems]);

  return (
    <div className={`${selectedItems.length === 0 ? 'hidden' : 'flyout'}`}>
      <p>
        {selectedItems.length} item{selectedItems.length > 1 && 's'} selected
      </p>
      <button onClick={handleUnselectAll}>Unselect all</button>
      {csvBlobUrl && (
        <a href={csvBlobUrl} download={`${selectedItems.length}_items.csv`}>
          <button>Download</button>
        </a>
      )}
    </div>
  );
};

export default Flyout;
