export interface Poem {
  id: string;
  title: string;
  body: string;
  subtitle?: string | null;
  dedication?: string | null;
  poem_date?: string | null;
  order_index: number;
  created_at?: string;
  updated_at?: string;
}

export type PoemFormData = {
  title: string;
  subtitle: string;
  body: string;
  dedication: string;
  poem_date: string;
  order_index: number;
};
