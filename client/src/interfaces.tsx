export interface Task {
  title: string;
  id: string;
}
export interface Todo {
  id?: string;
  title: string;
  description: string;
  deadline: string;
  completed: boolean;
}
export interface Values {
  title: string;
  description: string;
  deadline: string;
}
export interface FormValues {
  title: string;
  description: string;
  deadline: string;
}

export interface List {
  title: string;
  id?: string;
}