export const sendAuthenticatedRequest = async (
    url,
    method,
    setMessage,
    afterRequest,
    body = null,
    fullURL = false,
) => {
    let response;

    const base_url = process.env.REACT_APP_BACKEND_URL;

    if (!fullURL) {
        url = base_url + url;
    }
    if (body) {
        console.log('url', url);
        console.log('body', body);
        response = await fetch(url, {
            method: method,
            body: body,
            headers: new Headers({
                Authorization: 'Port ' + localStorage.getItem('stored_token'),
                'Content-Type': 'text/plain',
            }),
        });
    } else {
        response = await fetch(url, {
            method: method,
            headers: new Headers({
                Authorization: 'Port ' + localStorage.getItem('stored_token'),
            }),
        });
    }

    console.log('response', response);
    const responseJson = await response.json();
    console.log('responseJson', responseJson);
    if (response.status === 200 && responseJson.data) {
        afterRequest(responseJson);
    } else if (response.status === 403) {
        setMessage('A sua sessão expirou! Logando de novo...');
        const res2 = await fetch(`${base_url}/user/token/refresh/`, {
            method: 'post',
            body: JSON.stringify({
                refresh: localStorage.getItem('stored_refresh'),
            }),
            headers: new Headers({
                'Content-Type': 'application/json',
            }),
        });
        const info2 = await res2.json();
        if (res2.status === 400) {
            setMessage(
                'Houve algum problema ao tentar carregar a ficha do paciente!',
            );
        } else if (res2.status === 200) {
            localStorage.setItem('stored_token', info2.access);
            setMessage('Sessão restaurada!');
            sendAuthenticatedRequest(
                url,
                method,
                setMessage,
                afterRequest,
                body,
                true,
            );
        } else if (res2.status === 401) {
            setMessage(
                'A sua sessão expirou! Por favor, deslogue e logue de novo, por questão de segurança.',
            );
        }
    }
    else {
        console.log('debug');
        setMessage('Houve algum problema com o servidor!');
    } 
};
