import store from './store';

describe('store', () => {
  it('should initialize with default state', () => {
    const state = store.getState();
    expect(state.ingredients).toBeDefined();
    expect(state.user).toBeDefined();
    expect(state.orders).toBeDefined();
  });
});
