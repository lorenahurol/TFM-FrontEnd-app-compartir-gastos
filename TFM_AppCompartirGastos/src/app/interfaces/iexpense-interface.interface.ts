export interface IExpenseInterface {
  id: number;
  group_id: number;
  description: string;
  ammount: number;
  date: string;
  payer_user_id: number;
  active: boolean;
}
