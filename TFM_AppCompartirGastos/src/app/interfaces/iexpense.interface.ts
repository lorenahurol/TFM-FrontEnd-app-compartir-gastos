export interface IExpense {
  id:            number;
  group_id:      number;
  description:   string;
  amount:        number;
  date:          Date;
  payer_user_id: number;
  active:        number;
}
