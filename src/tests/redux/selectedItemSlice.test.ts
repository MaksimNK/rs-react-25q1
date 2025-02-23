import selectedItemReducer, {
  selectItem,
  unSelectItem,
  unSelectAll,
  SelectedItemState,
} from '../../redux/selectItemSlice';
import { IItem } from '../../types/item';

describe('selectedItemSlice reducer', () => {
  const initialState: SelectedItemState = { items: [] };

  const item1: IItem = {
    name: 'Luke Skywalker',
    url: 'https://swapi.dev/api/people/1/',
  };
  const item2: IItem = {
    name: 'Darth Vader',
    url: 'https://swapi.dev/api/people/4/',
  };

  it('should handle initial state', () => {
    expect(selectedItemReducer(undefined, { type: 'unknown' })).toEqual(
      initialState
    );
  });

  it('should handle selectItem', () => {
    const state = selectedItemReducer(initialState, selectItem(item1));
    expect(state.items).toHaveLength(1);
    expect(state.items).toContainEqual(item1);
  });

  it('should not add duplicate items when selectItem is dispatched again', () => {
    let state = selectedItemReducer(initialState, selectItem(item1));
    state = selectedItemReducer(state, selectItem(item1));
    expect(state.items).toHaveLength(1);
  });

  it('should handle unSelectItem', () => {
    let state = selectedItemReducer(initialState, selectItem(item1));
    state = selectedItemReducer(state, selectItem(item2));
    expect(state.items).toHaveLength(2);
    state = selectedItemReducer(state, unSelectItem(item1));
    expect(state.items).toHaveLength(1);
    expect(state.items).toEqual([item2]);
  });

  it('should handle unSelectAll', () => {
    let state = selectedItemReducer(initialState, selectItem(item1));
    state = selectedItemReducer(state, selectItem(item2));
    expect(state.items).toHaveLength(2);
    state = selectedItemReducer(state, unSelectAll());
    expect(state.items).toHaveLength(0);
  });
});
