import axios from "axios"



    const getRandomManga = () =>{
        console.log("executing GET for random manga")
        return axios({
            method: 'get',
            url: 'https://api.mangadex.org/manga/random',
            responseType: 'json'
        })
    }


    const api = {
        getRandomManga,
    };

    export default api;
    