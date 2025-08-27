declare module 'nsw-frontend-core-lib' {
    export function useDataLoader(loaderName: string): {
        get: () => any;
        loading: boolean;
        error: any;
    };
    
    export function coreLibQuery(query: any, variables?: any): Promise<any>;
    
    export function defineLoader(
        name: string,
        query: any,
        options?: {
            clean_fct?: (data: any) => any;
            socket_reload_message?: string;
        }
    ): void;
    
    export const socket: any;
    
    export function isNomoConnected(): boolean;
    export function useNomoConnected(): boolean;
    export function useSocketNonce(): string;
    export function onEvent(event: string, handler: Function): void;
    export function offEvent(event: string, handler: Function): void;
    export function emitMessage(message: string, data?: any): void;
    export function saveToLocalStorage(key: string, value: any): void;
    export function loadFromLocalStorage(key: string): any;
    export function useCountry(): any;
    export function useEvent(event: string): any;
    
    export const LOADERS: Record<string, string>;
}