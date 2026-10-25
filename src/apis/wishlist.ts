import { api } from '@/apis/instance';

export const putWishlist = async (stockId: number) => {
  await api.put(`/wishlists/${stockId}`);
};

export const deleteWishlist = async (stockId: number) => {
  await api.delete(`/wishlists/${stockId}`);
};
