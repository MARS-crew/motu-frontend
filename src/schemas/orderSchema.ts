import { z } from 'zod';

import { MIN_ORDER_QUANTITY, ORDER_ERROR_MESSAGES } from '@/constants/order';
import type { OrderSide } from '@/types/order';
import { getOrderAmounts } from '@/utils/order';

type OrderSchemaOptions = {
  side: OrderSide;
  tickSize: number;
  availablePoints: number;
  sellableQuantity: number;
};

const toNumber = (value: string) => Number(value.replaceAll(',', ''));

// 오류는 Toast로 하나씩 보여주므로 화면설계서의 안내 순서대로 첫 번째 오류에서 멈춥니다.
export const createOrderSchema = ({
  side,
  tickSize,
  availablePoints,
  sellableQuantity,
}: OrderSchemaOptions) =>
  z
    .object({
      price: z.string().trim(),
      quantity: z.string().trim(),
    })
    .superRefine(({ price, quantity }, context) => {
      const priceValue = toNumber(price);
      const quantityValue = toNumber(quantity);
      const addIssue = (path: 'price' | 'quantity', message: string) =>
        context.addIssue({ code: 'custom', path: [path], message });

      if (!price || !Number.isSafeInteger(priceValue) || priceValue <= 0) {
        return addIssue('price', ORDER_ERROR_MESSAGES.price);
      }
      if (priceValue % tickSize !== 0) return addIssue('price', ORDER_ERROR_MESSAGES.tickSize);
      if (!quantity || !Number.isSafeInteger(quantityValue)) {
        return addIssue('quantity', ORDER_ERROR_MESSAGES.quantity);
      }
      if (quantityValue < MIN_ORDER_QUANTITY) {
        return addIssue('quantity', ORDER_ERROR_MESSAGES.minQuantity);
      }
      if (
        side === 'buy' &&
        getOrderAmounts('buy', priceValue, quantityValue).total > availablePoints
      ) {
        return addIssue('quantity', ORDER_ERROR_MESSAGES.points);
      }
      if (side === 'sell' && quantityValue > sellableQuantity) {
        return addIssue('quantity', ORDER_ERROR_MESSAGES.sellableQuantity);
      }
    });

export type OrderForm = z.infer<ReturnType<typeof createOrderSchema>>;

export const cancelOrderIdSchema = z.number().int().positive();
export const cancelOrderResultSchema = z.object({
  orderId: cancelOrderIdSchema,
  status: z.literal('CANCELED'),
  remainingQty: z.literal(0),
});
