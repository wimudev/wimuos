export function useContext<T>(callback: () => T): T {
    return callback();
}