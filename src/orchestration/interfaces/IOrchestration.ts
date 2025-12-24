export interface IOrchestration<TPayload, TResult> {
    
    orchestrate(payload: TPayload): Promise<TResult>
}