// store.test.ts
import store from '../../redux/store';
import { selectItem, unSelectItem, unSelectAll } from '../../redux/selectItemSlice';
import { IItem } from '../../types/item';

describe('Redux Store Integration', () => {
  beforeEach(() => {
    store.dispatch(unSelectAll());
  });

  it('should have an initial state for selectedItem', () => {
    const state = store.getState();
    expect(state.selectedItem.items).toEqual([]);
  });

  it('should update selectedItem state on selectItem action', () => {
    const item: IItem = { name: 'Luke Skywalker', url: 'https://swapi.dev/api/people/1/' };
    store.dispatch(selectItem(item));
    const state = store.getState();
    expect(state.selectedItem.items).toContainEqual(item);
  });

  it('should update selectedItem state on unSelectItem action', () => {
    const item: IItem = { name: 'Luke Skywalker', url: 'https://swapi.dev/api/people/1/' };
    store.dispatch(selectItem(item));
    store.dispatch(unSelectItem(item));
    const state = store.getState();
    expect(state.selectedItem.items).not.toContainEqual(item);
  });

  it('should update selectedItem state on unSelectAll action', () => {
    const item1: IItem = { name: 'Luke Skywalker', url: 'https://swapi.dev/api/people/1/' };
    const item2: IItem = { name: 'Darth Vader', url: 'https://swapi.dev/api/people/4/' };
    store.dispatch(selectItem(item1));
    store.dispatch(selectItem(item2));
    store.dispatch(unSelectAll());
    const state = store.getState();
    expect(state.selectedItem.items).toEqual([]);
  });
});
