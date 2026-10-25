import { NOTICE_TYPE_LABELS } from '@/constants/notice';
import type { NoticeDetail, NoticeDetailItem, NoticeItem, NoticeListItem } from '@/types/notice';
import { formatDotDate } from '@/utils/formatDate';

// 공지 API 응답을 화면에서 쓰는 형태로 바꿉니다.
export const toNoticeListItem = (notice: NoticeItem): NoticeListItem => ({
  id: notice.noticeId,
  title: notice.title,
  category: NOTICE_TYPE_LABELS[notice.type],
  isImportant: notice.isImportant,
  createdAt: formatDotDate(notice.postDate),
});

export const toNoticeDetail = (notice: NoticeDetailItem): NoticeDetail => ({
  ...toNoticeListItem(notice),
  content: notice.content,
});
