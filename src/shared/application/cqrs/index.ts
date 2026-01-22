export interface Command<Result = any> {}
export interface Query<Result = any> {}

export interface CommandHandler<C, Result = any> {
  execute(command: C): Promise<Result> | Result;
}

export interface QueryHandler<Q, Result = any> {
  execute(query: Q): Promise<Result> | Result;
}
