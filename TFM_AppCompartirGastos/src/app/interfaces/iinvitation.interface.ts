export interface IInvitation {
  id?: number;
  date?: Date;
  group_id: number;
  user_id: number;
  accepted: number;
  active: number;
  message: string;
}
