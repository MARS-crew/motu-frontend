import { z } from 'zod';

export const searchSchema = z.object({
  keyword: z.string().trim().min(1, '검색어를 입력해 주세요.'),
});

export type SearchForm = z.infer<typeof searchSchema>;
