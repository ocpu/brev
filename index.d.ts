declare function brev<T>(): brev.Brev<T>
declare namespace brev {
  interface EventStream<E> {
    /**
     * Choose what values are proceded in the chain.
     * @param predicate 
     */
    filter(predicate: (obj: E) => boolean): EventStream<E>
    /**
     * Transform the value to a different value.
     * @param transformer 
     */
    map<R>(transformer: (obj: E) => R): EventStream<R>
    /**
     * Run a handler with the current value.
     * @param action What you want to do the the event.
     */
    forEach(action: (obj: E) => void): EventStream<E>
    /**
     * Stop reciveing events on the stream.
     */
    stop()
  }

  export interface Brev<E> {
    /**
     * Add a listener for the event given on this event bus.
     * 
     * @param topic The event to listen to.
     * @param listener The actual listener to get fired.
     */
    on<K extends keyof E>(topic: K, listener: (event: E[K]) => void): Brev<E>
    /**
     * Add a listener for the event given on this event bus.
     * 
     * @param topic The event to listen to.
     * @param listener The actual listener to get fired.
     */
    on(topic: string, listener: (event: any) => void): Brev<E>
    /**
     * Unregister a listener from the given event.
     *
     * @param topic The event the listener is registered on.
     * @param listener The listener to remove. 
     */
    off<K extends keyof E>(topic: K, listener: (event: E[K]) => void): Brev<E>
    /**
     * Unregister a listener from the given event.
     *
     * @param topic The event the listener is registered on.
     * @param listener The listener to remove. 
     */
    off(topic: string, listener: (event: any) => void): Brev<E>
    /**
     * Registers a handler to the given event.
     * It will only be called one time before it is unregistered.
     * 
     * It returns a promise containing the event if no listener was registered.
     * Otherwise the promise contains the result of the listener.
     *
     * @param topic The event to listen to.
     * @param listener The actual listener to get fired.
     */
    once<K extends keyof E>(topic: K): Promise<E[K]>
    /**
     * Registers a handler to the given event.
     * It will only be called one time before it is unregistered.
     * 
     * It returns a promise containing the event if no listener was registered.
     * Otherwise the promise contains the result of the listener.
     *
     * @param topic The event to listen to.
     * @param listener The actual listener to get fired.
     */
    once<K extends keyof E, Result>(topic: K, listener: (event: E[K]) => Result): Promise<Result>
    /**
     * Registers a handler to the given event.
     * It will only be called one time before it is unregistered.
     * 
     * It returns a promise containing the event if no listener was registered.
     * Otherwise the promise contains the result of the listener.
     *
     * @param topic The event to listen to.
     * @param listener The actual listener to get fired.
     */
    once(topic: string): Promise<any>
    /**
     * Registers a handler to the given event.
     * It will only be called one time before it is unregistered.
     * 
     * It returns a promise containing the event if no listener was registered.
     * Otherwise the promise contains the result of the listener.
     *
     * @param topic The event to listen to.
     * @param listener The actual listener to get fired.
     */
    once<Result>(topic: string, listener: (event: any) => Result): Promise<Result>
    /**
     * Add a listener for the event given on this event bus.
     * It will only be called x amount of times before it is automatically unregistered.
     * 
     * @param topic The event to listen to.
     * @param max The maximum amount of times the listener can be called.
     * @param listener The actual listener to get fired.
     */
    many<K extends keyof E>(topic: K, max: number, listener: (event: E[K]) => void): Brev<E>
    /**
     * Add a listener for the event given on this event bus.
     * It will only be called x amount of times before it is automatically unregistered.
     * 
     * @param topic The event to listen to.
     * @param max The maximum amount of times the listener can be called.
     * @param listener The actual listener to get fired.
     */
    many<T>(topic: string, max: number, listener: (event: T) => void): Brev<E>
    /**
     * Emit a event to all listeners registered to the given `event`.
     *
     * @param topic The event name to execute the event on.
     * @param data The event to get passed to listeners.
     */
    emit<K extends keyof E>(topic: K, data: E[K]): void
    /**
     * Mixin this eventbus into another object.
     * 
     * @param obj The object to mix into.
     */
    mixin<T>(obj: T): T & Brev<E>
    /**
     * Register a stram on a event.
     * @param topic The event to observe.
     */
    stream<K extends keyof E>(topic: K): EventStream<E[K]>
    /**
     * Register a observer on a event.
     * @param topic The event to observe.
     */
    stream<T>(topic: string): EventStream<T>
    /**
     * Register a observer on a event.
     * @param topic The event to observe.
     */
    stream(topic: string): EventStream<any>
  }

  export function createBus<T>(): Brev<T>
}

export = brev
