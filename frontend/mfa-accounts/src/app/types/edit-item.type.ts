export type InputState = undefined | 'success' | 'error';

export type InputNames =
  | 'title'
  | 'description'
  | 'price'
  | 'discountPercentage'
  | 'stock';

export type DataForm = {
  [key in InputNames]: {
    value: string;
    state?: InputState;
  };
};
