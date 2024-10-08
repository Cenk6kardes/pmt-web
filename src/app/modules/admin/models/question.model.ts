export interface IQuestionItem {
  id: string;
  title: string;
  titleEN: string;
  note: string;
  description: string;
  questionTypeId: number | null;
  questionType: string;
  isRemoved: boolean;
}
