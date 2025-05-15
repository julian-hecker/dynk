export type APIResponse<T = object> =
    | { success: true; data: T }
    | { success: false; error: string };

export type AsyncParams<T> = { params: Promise<T> };
