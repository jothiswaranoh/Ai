const BASE_URL = 'http://localhost:8000';

type FetchOptions = Omit<RequestInit, 'body'> & {
    body?: any;
    headers?: Record<string, string>;
};

export async function client(endpoint: string, { body, ...customConfig }: FetchOptions = {}) {
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

    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (response.ok) {
        return data;
    } else {
        return Promise.reject(data);
    }
}
