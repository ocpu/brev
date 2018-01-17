declare interface BrevObservabe<E> {
    /**
     * Choose what values are proceded in the chain.
     * @param predicate 
     */
    filter(predicate: (obj: E) => boolean): BrevObservabe<E>
    /**
     * Transform the value to a different value.
     * @param transformer 
     */
    map<R>(transformer: (obj: E) => R): BrevObservabe<R>
    /**
     * Run a handler with the current value.
     * @param handler What you want to do the the event.
     */
    run(handler: (obj: E) => void): BrevObservabe<E>
    /**
     * Unobserve the observer.
     */
    unobserve()
}

declare interface Brev {
    /**
     * Add a listener for the event given on this event bus.
     * 
     * @param topic The event to listen to.
     * @param listener The actual listener to get fired.
     */
    on<T>(topic: string, listener: (event: T) => void): Brev
    /**
     * Unregister a listener from the given event.
     *
     * @param topic The event the listener is registered on.
     * @param listener The listener to remove. 
     */
    off<T>(topic: string, listener: (event: T) => void): Brev
    /**
     * Registers a handler to the given topic.
     * It will only be called one time before it is unregistered.
     * 
     * It returns a promise containing the event if no listener was registered.
     * Otherwise the promise contains the result of the listener.
     *
     * @param topic The event to listen to.
     * @param listener The actual listener to get fired.
     */
    once<T, Result>(topic: string, listener?: (event: T) => Result): Promise<Result>
    /**
     * Add a listener for the event given on this event bus.
     * It will only be called x amount of times before it is automatically unregistered.
     * 
     * @param topic The event to listen to.
     * @param max The maximum amount of times the listener can be called.
     * @param listener The actual listener to get fired.
     */
    many<T>(topic: string, max: number, listener: (event: T) => void): Brev
    /**
     * Emit a event to all listeners registered to the given `topic`.
     *
     * @param topic The event name to execute the event on.
     * @param event The event to get passed to listeners.
     * @param onlyLocal Whether or not the event should be broadcasted to the serviceworker / tabs. Default: false.
     */
    emit(topic: string, event?: any, onlyLocal?: boolean): void
    /**
     * Mixin this eventbus into another object.
     * 
     * @param obj The object to mix into.
     */
    mixin<T>(obj: T): T | Brev
    /**
     * Register a observer on a topic.
     * @param topic The topic to observe.
     */
    observe<E>(topic: string): BrevObservabe<E>
    /**
     * Register a observer on a topic.
     * @param topic The topic to observe.
     */
    observe(event: string): BrevObservabe<any>
}

declare var createBus: { (): Brev } & Brev

declare module "brev" {
    export = createBus
}

export = createBus
