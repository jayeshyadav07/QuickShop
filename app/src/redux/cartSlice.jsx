import { createSlice } from '@reduxjs/toolkit';

export const cartSlice = createSlice({
	name: 'cart',
	initialState: {
		cartItems: localStorage.getItem('cartItems')
			? JSON.parse(localStorage.getItem('cartItems'))
			: [],
	},
	reducers: {
		addToCart: (state, action) => {
			const item = action.payload;
			const isExist = state.cartItems.find((i) => i.id === item.id);
			if (isExist) {
				state.cartItems = state.cartItems.map((i) => (i.id === item.id ? item : i));
			} else {
				state.cartItems.push(item);
			}
			localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
		},
		removeFromCart: (state, action) => {
			state.cartItems = state.cartItems.filter((item) => item.id !== action.payload);
			localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
		},
		clearCart: (state) => {
			state.cartItems = [];
			localStorage.removeItem('cartItems');
		},
	},
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export const cartReducer = cartSlice.reducer;
