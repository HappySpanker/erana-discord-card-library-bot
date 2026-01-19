export interface IOrchestration<TPayload, TResult> {
    
    Orchestrate(payload: TPayload): Promise<TResult>
}