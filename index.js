// //Dom 
// const button = document.querySelector('#button');
// const list = document.querySelector('#list');
// const stop = document.querySelector('#stop');




// //api
// const fetch1 = async() => {
//     let url = 'https://jsonplaceholder.typicode.com/comments';
//     let response = await fetch(url);
//     return await response.json();
// }

// const fetch1helper = async() => {
//     return await fetch1()
//         .then(data => {
//             return data.map(value => {
//                 return {
//                     body: value.body,
//                     email: value.email
//                 }
//             })
//         })
// }

// const fetch2 = async() => {
//     let url = 'https://jsonplaceholder.typicode.com/photos';
//     let response = await fetch(url);
//     return await response.json();
// }

// const fetch2helper = async() => {
//     return await fetch2()
//         .then(data => {
//             return data.map(value => {
//                 return {
//                     title: value.title,
//                     thumbnailUrl: value.thumbnailUrl
//                 }
//             })
//         })
//         .then(data => {
//             data.forEach(value => {
//                 let li = `<li>${value.title} ---- ${value.thumbnailUrl}</li>`
//                 list.insertAdjacentHTML('beforeend', li)
//             })

//         })
// }

// //rx js
// const buttonStream$ = Rx.Observable.fromEvent(button, 'click');
// const fetch1Stream$ = Rx.Observable.fromPromise(fetch1helper());
// const stopStream$ = Rx.Observable.fromEvent(stop, 'click')
//     // const fetch2Stream$ = Rx.Observable.fromPromise(fetch2helper())




// // buttonStream$
// //     .switchMap(() => {
// //         return Rx.Observable.interval(1000)
// //             .takeUntil(stopStream$)
// //             .map(i => ['hey', 2, 3, 4, 5][i])
// //     })
// //     .subscribe(x => {
// //         console.log(x)
// //     })


const busObservable = Rx.Observable.of({ code: 'en-us', value: '-Test-' }, { code: 'en-us', value: 'hello' }, { code: 'es', value: '-TEST-' }, { code: 'en-us', value: 'ola' }, { code: 'pt-br', value: 'hola' }, { code: 'es', value: 'world' }, { code: 'pt-br', value: 'mundo' })

const groupByStream$ = busObservable
    .groupBy(obj => obj.code)
    .mergeMap(x => x.skip(1).map(x => x.value))
    .subscribe(x => console.log(x))






//////// find your partner   
const img = document.querySelector('.img');
const text = document.querySelector('.text');
const topTitle = document.querySelector('.top')
const no = document.querySelector('.no')
const animated = document.querySelector('.animated')

const NoStream$ = Rx.Observable.fromEvent(no, 'click')
    .switchMap(click => {
        if (animated.classList.contains('jello')) {
            animated.classList.remove('jello');
            animated.classList.add('rubberBand')
        } else if (animated.classList.contains('rubberBand')) {
            animated.classList.remove('rubberBand');
            animated.classList.add('jello')
        }
        return Rx.Observable.fromPromise(fetchSexyGirlHelper())
    })



const fetchSexyGirl = async() => {
    let response = await fetch('https://randomuser.me/api/');
    return await response.json();
}

const fetchSexyGirlHelper = async() => {
    return await fetchSexyGirl()
        .then(data => {
            let result = data.results;
            return result[0];
        })
        .then(data => {
            return {
                location: data.location.city,
                name: `${data.name.first} ${data.name.last}`,
                pic: data.picture.large,
                gender: data.gender
            }
        })
}

const fetchSexyStream$ = Rx.Observable.fromPromise(fetchSexyGirlHelper())
    .merge(NoStream$)
    .share()
    .retryWhen(err => {
        return err.delay(100)
    })
    .subscribe(x => {
            if (x.gender === 'female') {
                topTitle.innerHTML = 'Do you want her?'
            } else {
                topTitle.innerHTML = 'Do you want him?'
            }
            let pic = `<img class='img-responsive' src='${x.pic}'>`
            let name = `<h4>${x.name}</h4>`
            let location = `<h4>${x.location}</h4>`;
            img.innerHTML = `<img class='img-responsive' src='${x.pic}'>`;
            text.innerHTML = `<h4><span>name:</span> ${x.name}</h4> <h4><span>location:</span> ${x.location}</h4>`
        },
        err => console.warn(err),
        complete => console.log('completed')
    )