//HTTP
const API_KEY= '34096302-1d0272a92e2c550c5171e7dff';
const BASE_URL = 'https://pixabay.com/api/';
let OPTIONS = 'image_type=photo&orientation=horizontal&safesearch=true';
const PER_PAGE = 40

// клас, що містить методи і відповідає за:
export default class NewApiService{
    constructor() {
        this.searchQuery = ''; // зберігання запиту(з поля вводу запитуване слово)
        this.page = 1; //номер групи
    }

async fechPixabay() { //робимо запит та отримуємо об'єкти
    try {
        const response = await fetch(`${BASE_URL}?key=${API_KEY}&q=${this.searchQuery}&${OPTIONS}&per_page=${PER_PAGE}&page=${this.page}`)
    const data = await response.json();
        let dataMasive = [data.hits, this.page, data.totalHits, PER_PAGE];
        this.incrementPage();
        if (data.hits.length === 0) {
            return Error
        } return dataMasive //повертаємо результат фетча 
    }
    catch(error){
        console.log(error)
    }
}


    incrementPage() { //після отримання рез. і натискання Load More додається слудуюча сторінка
        this.page += 1;  
    }

    resetNumberPage() { // під час нового запиту робимо скид до першої сторінки 
        this.page = 1;  
    }

    //контроль терміну запиту, отримання даних та можливість перезапису за необхідності
    get query(){
        return this.searchQuery; 
    }

    set query(newQuery){
        this.searchQuery = newQuery; 
    }

}  


