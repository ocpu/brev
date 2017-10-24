declare interface Brev {
    /**
     * Add a listener for the event given on this event bus.
     * 
     * @param eventName The event to listen to.
     * @param listener The actual listener to get fired.
     */
    on<T>(eventName: string, listener: (event: T) => void): Brev
    /**
     * Unregister a listener from the given event.
     *
     * @param eventName The event the listener is registered on.
     * @param listener The listener to remove. 
     */
    off<T>(eventName: string, listener: (event: T) => void): void
    /**
     * Registers a handler to the given eventName.
     * It will only be called one time before it is unregistered.
     * 
     * It returns a promise containing the event if no listener was registered.
     * Otherwise the promise contains the result of the listener.
     *
     * @param eventName The event to listen to.
     * @param listener The actual listener to get fired.
     */
    once<T, Result>(eventName: string, listener?: (event: T) => Result): Promise<Result>
    /**
     * Add a listener for the event given on this event bus.
     * It will only be called x amount of times before it is automatically unregistered.
     * 
     * @param eventName The event to listen to.
     * @param max The maximum amount of times the listener can be called.
     * @param listener The actual listener to get fired.
     */
    many<T>(eventName: string, max: number, listener: (event: T) => void): Brev
    /**
     * Emit a event to all listeners registered to the given `eventName`.
     *
     * @param eventName The event name to execute the event on.
     * @param event The event to get passed to listeners.
     * @param local Restrict to only local tab/instance. Default is false.
     */
    emit(eventName: string, event?: any, local?: boolean): void
    /**
     * Mixin this eventbus into another object.
     * 
     * @param obj The object to mix into.
     */
    mixin<T>(obj: T): T & Brev
}

declare module "brev" {
    /**
     * Creates a new and fresh event bus.
     */
    export function createBus(): Brev
}

/**
 * Creates a new and fresh event bus.
 */
export function createBus(): Brev
