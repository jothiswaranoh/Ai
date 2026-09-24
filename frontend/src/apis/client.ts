const BASE_URL = (
    import.meta.env.VITE_API_URL ||
    import.meta.env.VITE_BASE_URL ||
    'http://localhost:8000/api/v1'
).replace(/\/+$/, '');

type FetchOptions = Omit<RequestInit, 'body'> & {
    body?: any;
    headers?: Record<string, string>;
};

export async function client<T = any>(endpoint: string, { body, ...customConfig }: FetchOptions = {}): Promise<T> {
    const token = localStorage.getItem('token');
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const config: FetchOptions = {
        method: body ? 'POST' : 'GET',
        ...customConfig,
        headers: {
            ...headers,
            ...customConfig.headers,
        },
    };

    if (body) {
        config.body = JSON.stringify(body);
    }

    const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const response = await fetch(`${BASE_URL}${normalizedEndpoint}`, config);
    let data: any;
    try {
        data = await response.json();
    } catch {
        data = { detail: 'An unexpected server response occurred' };
    }

    if (response.ok) {
        return data;
    } else {
        // Normalize FastAPI detail (which can be array of objects or string) into a friendly string
        let formattedDetail = 'An error occurred';
        if (typeof data.detail === 'string') {
            formattedDetail = data.detail;
        } else if (Array.isArray(data.detail)) {
            formattedDetail = data.detail
                .map((errItem: any) => {
                    if (typeof errItem === 'string') return errItem;
                    if (errItem && typeof errItem === 'object') {
                        const field = Array.isArray(errItem.loc) ? errItem.loc.slice(1).join('.') : '';
                        return field ? `${field}: ${errItem.msg || 'invalid'}` : (errItem.msg || JSON.stringify(errItem));
                    }
                    return String(errItem);
                })
                .join('; ');
        } else if (data.message && typeof data.message === 'string') {
            formattedDetail = data.message;
        }

        const normalizedError = {
            ...data,
            detail: formattedDetail,
            message: formattedDetail,
            status: response.status,
        };

        return Promise.reject(normalizedError);
    }
}

client.get = <T = any>(endpoint: string, config?: FetchOptions) => client<T>(endpoint, { ...config, method: 'GET' });
client.post = <T = any>(endpoint: string, body?: any, config?: FetchOptions) => client<T>(endpoint, { ...config, method: 'POST', body });
client.put = <T = any>(endpoint: string, body?: any, config?: FetchOptions) => client<T>(endpoint, { ...config, method: 'PUT', body });
client.delete = <T = any>(endpoint: string, config?: FetchOptions) => client<T>(endpoint, { ...config, method: 'DELETE' });

