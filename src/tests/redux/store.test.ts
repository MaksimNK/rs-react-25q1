import { configureStore } from '@reduxjs/toolkit';
import selectedItemReducer, {
  selectItem,
  unSelectItem,
  unSelectAll,
} from '../../redux/selectItemSlice';
import { RootState, AppDispatch } from '../../redux/store';
import { IItem } from '../../utils/api';

describe('Redux Store Configuration', () => {
  const testItem: IItem = {
    name: 'Test Item',
    url: 'http://test.com/item/1',
  };

  let store: ReturnType<typeof configureStore<RootState>>;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        selectedItem: selectedItemReducer,
      },
    });
  });

  it('should have correct initial state', () => {
    const state = store.getState();
    expect(state.selectedItem.items).toEqual([]);
  });

  it('should handle item selection', () => {
    store.dispatch(selectItem(testItem));
    const state = store.getState();
    expect(state.selectedItem.items).toContainEqual(testItem);
  });

  it('should handle item unselection', () => {
    // First select the item
    store.dispatch(selectItem(testItem));

    // Then unselect it
    store.dispatch(unSelectItem(testItem));

    const state = store.getState();
    expect(state.selectedItem.items).not.toContainEqual(testItem);
  });

  it('should handle unselect all', () => {
    // Add multiple items
    store.dispatch(selectItem(testItem));
    store.dispatch(
      selectItem({
        name: 'Another Item',
        url: 'http://test.com/item/2',
      })
    );

    // Unselect all
    store.dispatch(unSelectAll());

    const state = store.getState();
    expect(state.selectedItem.items).toHaveLength(0);
  });

  it('should have correct type definitions', () => {
    // Test type exports
    const dispatch: AppDispatch = store.dispatch;
    const state: RootState = store.getState();

    expect(typeof dispatch).toBe('function');
    expect(state).toHaveProperty('selectedItem');
  });
});
