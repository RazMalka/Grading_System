// Request JS
// 05/06/21 07:50AM

// SHOULD BE CALLED FROM AN ASYNC FUNCTION (!!!)
export async function POST(message, path) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(message)
    };

    let res;

    res = await fetch('http://localhost:5500/' + path, requestOptions)
        .then(response => response.json())
        .then(response => { return response })
    return res;
}