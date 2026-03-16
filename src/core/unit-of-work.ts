export interface UnitOfWork {
  execute<T>(fn: (trx: unknown) => Promise<T>): Promise<T>;
}
