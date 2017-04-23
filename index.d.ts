module brev {
    interface BrevListener {
        executed: number
        max: number
        listener: (event: any) => void
    }

    class Brev {
        _listeners: Object

        private _search(eventName: string, listener: (event: any) => void): number

        on(eventName: string, listener: (event: any) => void): void

        off(eventName: string, listener: (event: any) => void): void

        once<Result>(eventName: string, listener?: (event: any) => Result): PromiseLike<any | Result>

        many(eventName: string, max: number, listener: (event: any) => void): void

        emit(eventName: string, event?: any): void
    }

    function createBus(): Brev

    function reflect(bus: Brev, eventName?: string): string[] | BrevListener[]
}