export interface EventDomain<T> {
    id: string;
    date: Date;
    data: T;
}