
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import NewApiService from './js/api.js'
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const searchForm = document.querySelector('.search-form');
const btnForm = document.querySelector('.btn');
const galleryForm = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

const newApiService = new NewApiService(); //елземпляр класу NewApiService

let lightbox = new SimpleLightbox('.gallery a' ,{ //бібліотека(додавання ефектів для зображення)
    captionDelay: 250,
    enableKeyboard: true,
});

loadMoreBtn.classList.add('is-hidden'); //прихована кнопка

searchForm.addEventListener('submit',onSearchForm);
loadMoreBtn.addEventListener('click',onLoadMore);

function onSearchForm(e) {
    reseterPage()
    e.preventDefault();
    newApiService.query = e.target.elements.query.value;
     
    if (newApiService.query === "" || newApiService.query === undefined) {//виклик повідомлення при порожньому полі вводу 
        reseterPage();
       return Notify.failure(
            'Sorry, there are no images matching your search query. Please try again.'
        );
    } 
    loadMoreBtn.classList.add('is-hidden');
    newApiService.resetNumberPage();
    newApiService.fechPixabay()
    .then(createGallery)
    .catch(onFetcherror);
} 


function onLoadMore(){  // у функції виконується побудова  та завантаження карток при натисканні на  кнопку Load Morе
    loadMoreBtn.classList.add('is-hidden');
    newApiService.fechPixabay()
    .then(createGallery);
     
}

function reseterPage () {  //очистка сторінки+прихована кнопка 
    loadMoreBtn.classList.add('is-hidden');
    galleryForm.innerHTML = '';
    
} 

function onFetcherror (error){ //повідомлення про помилку + прихована кнопка
    loadMoreBtn.classList.add('is-hidden')
    return Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
    );
} 

 
function createGallery(dataMasive) {
    if(dataMasive[1] === Math.ceil(dataMasive[2] / dataMasive[3])) { //умови для побудови картки
    Notify.info ("We're sorry, but you've reached the end of search results."); 
    loadMoreBtn.classList.add('is-hidden')};

        if (dataMasive[0].length === 0) {
            loadMoreBtn.classList.remove('is-hidden')
        }  
            Notify.info (`Hooray! We found ${dataMasive[2]} images.`);
            
            loadMoreBtn.classList.remove('is-hidden')
        
    const cardsMarcup = dataMasive[0].map(
        ({webformatURL,largeImageURL,tags,
            likes,views,comments,downloads,
        }) => {return `
    <div class="photo-card">
        <a class="photo-link" href="${largeImageURL}">
        <img class="photo" src="${webformatURL}" alt="${tags}" loading="lazy"/>
        </a>
        <div class="info">
        <p class="info-item">
            <b>Likes</b>${likes}
        </p>
        <p class="info-item">
            <b>Views</b>${views}
        </p>
        <p class="info-item">
            <b>Comments</b>${comments}
        </p>
        <p class="info-item">
            <b>Downloads</b>${downloads}
        </p>
    </div>
    </div>`;
        })
        .join('');
    galleryForm.insertAdjacentHTML('beforeend',cardsMarcup);
    lightbox.refresh();
} 

