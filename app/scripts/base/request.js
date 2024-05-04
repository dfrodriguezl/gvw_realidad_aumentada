const axios = require('axios');

import { urlDeploy } from './variables'

const destino = urlDeploy;

export function servidorQuery(uri) {
    return axios.get(uri)
        .then(res => {
            return (res)
        })
}

export function servidorPost(uri, datos) {

    return axios({
        method: 'post',
        url: destino + uri,
        data: datos,
        withCredentials: false
    })

}

export function servidorGetRaw(uri) {
    return axios.get(destino + uri).then(resp => {
        return (resp.data);
    });
}

export function servidorGet(uri) {
    return axios.get(destino + uri, {
        responseType: 'blob',
    }).then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', uri + '.zip'); //or any other extension
        document.body.appendChild(link);
        link.click();
    });
}

export function redireccionar(error) {
    if (error.response.status == 403) {
        window.location.href = './login.html';
    }
}

export function getData(uri) {

    return axios.get(destino + uri,

        {
            responseType: 'arraybuffer'
        }
    ).then(resp => {

        return (resp);

    });

}

export function servidorQuery2(uri) {
    return axios.get(uri);
}



