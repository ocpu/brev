declare function brev<T>(): brev.Brev<T>
declare namespace brev {
  interface BrevObservabe<E> {
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

  export interface Brev<EventMap> {
    /**
     * Add a listener for the event given on this event bus.
     * 
     * @param topic The event to listen to.
     * @param listener The actual listener to get fired.
     */
    on<K extends keyof EventMap>(topic: K, listener: (event: EventMap[K]) => void): this
    /**
     * Unregister a listener from the given event.
     *
     * @param topic The event the listener is registered on.
     * @param listener The listener to remove. 
     */
    off<K extends keyof EventMap>(topic: K, listener: (event: EventMap[K]) => void): this
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
    once<K extends keyof EventMap>(topic: K): Promise<EventMap[K]>
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
    once<K extends keyof EventMap, Result>(topic: K, listener: (event: EventMap[K]) => Result): Promise<Result>
    /**
     * Add a listener for the event given on this event bus.
     * It will only be called x amount of times before it is automatically unregistered.
     * 
     * @param topic The event to listen to.
     * @param max The maximum amount of times the listener can be called.
     * @param listener The actual listener to get fired.
     */
    many<K extends keyof EventMap>(topic: K, max: number, listener: (event: EventMap[K]) => void): this
    /**
     * Emit a event to all listeners registered to the given `topic`.
     *
     * @param topic The event name to execute the event on.
     * @param event The event to get passed to listeners.
     */
    emit<K extends keyof EventMap>(topic: K, event: EventMap[K]): void
    /**
     * Emit a event to all listeners registered to the given `topic` locally.
     *
     * @param topic The event name to execute the event on.
     * @param event The event to get passed to listeners.
     */
    emitLocal(topic: string, event?: any): void
    /**
     * Mixin this eventbus into another object.
     * 
     * @param obj The object to mix into.
     */
    mixin<T>(obj: T): T & Brev<EventMap>
    /**
     * Register a observer on a topic.
     * @param topic The topic to observe.
     */
    observe<K extends keyof EventMap>(topic: K): BrevObservabe<EventMap[K]>
    /**
     * Register a observer on a topic.
     * @param topic The topic to observe.
     */
    observe<T>(topic: string): BrevObservabe<T>
    /**
     * Register a observer on a topic.
     * @param topic The topic to observe.
     */
    observe(event: string): BrevObservabe<any>
  }

  export function createBus<T>(): Brev<T>
}

export = brev
