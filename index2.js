//Dom
const button = document.querySelector('#button');





const fetch1 = async() => {
    let url = 'https://jsonplaceholder.typicode.com/comments';
    let response = await fetch(url);
    return await response.json();
}

const fetch1helper = async() => {
    return await fetch1()
        .then(data => {
            return data.map(value => {
                return {
                    body: value.body,
                    email: value.email
                }
            })
        })
}

const fetch2 = async() => {
    let url = 'https://jsonplaceholder.typicode.com/photos';
    let response = await fetch(url);
    return await response.json();
}

const fetch2helper = async() => {
    return await fetch2()
        .then(data => {
            return data.map(value => {
                return {
                    title: value.title,
                    thumbnailUrl: value.thumbnailUrl
                }
            })
        })
        .then(data => {
            data.forEach(value => {
                let li = `<li>${value.title} ---- ${value.thumbnailUrl}</li>`
                list.insertAdjacentHTML('beforeend', li)
            })

        })
}


const buttonStream$ = Rx.Observable.fromEvent(button, 'click');
const fetch1Promise$ = Rx.Observable.fromPromise(fetch1());
const fetch2Promise$ = Rx.Observable.fromPromise(fetch2())
const gettingDataStream$ = buttonStream$
    .switchMap(x => {
        return Rx.Observable.combineLatest(fetch1Promise$, fetch2Promise$)
    })
    .subscribe(x => console.log(x))