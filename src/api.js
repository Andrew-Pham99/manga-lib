import axios from "axios"
/*
Global rate limit of 5 requests a second per IP address in affect for most requests.
Optimal to use larger batch requests than smaller individual ones.
*/


//TODO: RETRIEVE IMAGES FROM CHAPTERS, COVER ART, ETC.

const base_url = 'https://api.mangadex.org'
/**
 * @returns {Promise} GET response as a Promise
 */
    const getRandomManga = () =>{
        console.log("executing GET request for random manga...")
        return axios({
            method: 'get',
            url: base_url + '/manga/random',
            responseType: 'json'
        })
    }

    /**
     * 
     * @param {Object} queryParams 
     * @returns {Promise} GET response as a Promise
     */
    const queryManga = (queryParams) => {
        console.log("executing GET request for queried manga...")
        return axios({
            method: 'get',
            url: base_url + '/manga',
            responseType: 'json',
            params: {
                limit: 100,
                ...queryParams
            }
        })
    }

    /**
     * 
     * @param {Array} coverIds - Array of cover ids
     * @returns {Promise} GET response as a Promise containing cover art files
     */
    const getCoverArtList = (coverIds) => {
        console.log("executing GET request for cover art...")
        return axios({
            method: 'get',
            url: base_url + '/cover',
            responseType: 'json',
            params: {
                limit: 100,
                ids: coverIds
            }
        })
    }

    /**
     * 
     * @param {Array} queryParams 
     * @returns {Promise} GET response as a Promise 
     */
    const getChapterList = (queryParams) => {
        console.log("executig GET request for chapter lists...")
        return axios({
            method: 'get',
            url: base_url + '/chapter',
            responseType:'json',
            params: {
                limit: 100,
                translatedLanguage: 'en',
                ...queryParams
            }
        })
    }


    const api = {
        getRandomManga,
        queryManga,
        getCoverArtList,
        getChapterList
    };

    export default api;
    